const Xray = require('x-ray');
const phantom = require('x-ray-phantom');
const Promise = require('bluebird');

var x = Xray({
    filters: {
        trim: function (value) {
            return typeof value === 'string' ? value.trim() : value
        }
    }
}).driver(phantom());

decryptDlProtecteUrl = (url) => {
    let words = [['https://www.dl-protecte.com/', ''],
    ['http://www.dl-protecte.com/', ''],
    ['123455600', 'http://'],
    ['123455601', 'https://'],
    ['123455602', 'uptobox'],
    ['123455603', '1fichier'],
    ['123455604', 'uploaded'],
    ['123455605', 'ul.to'],
    ['123455606', 'rapidgator'],
    ['23455607', 'turbobit'],
    ['123455608', 'nitroflare'],
    ['123455609', 'uplea'],
    ['123455610', '.com'],
    ['123455611', '.net'],
    ['123455611', '.org'],
    ['123455613', 'video'],
    ['123455614', 'embed'],
    ['123455615', '/'],
    ['123455616', '#'],
    ['123455617', '?']];

    for (var i = 0; i < words.length; i++) {
        url = url.replace(words[i][0], words[i][1]);
    }
    return url;
}

module.exports = class ZoneTelechargement {
    static search(query, pageLimit = 1) {
        query = encodeURI(query);
        
//         let url = 'https://wwwwv.annuaire-telechargement.com//index.php?' +
//             'do=search&subaction=search&search_start=1&full_search=1&result_from=1&story=' + query +
//             '&all_word_seach=1&titleonly=3&searchuser=&replyless=0&replylimit=0&searchdate=0&beforeafter=after&sortby=date&resorder=desc&showposts=0&catlist%5B%5D=0';
	   let url = 'https://zt-za.com/engine/ajax/controller.php?mod=filter&catid=0&q=' + query + 
	       '&note=0&art=0&AiffchageMode=0&inputTirePar=0&cstart=0' 

        return Promise.fromCallback(x(url, '.cover_global', [{
            title: '.cover_infos_global > .cover_infos_title > a@text | trim',
            link: '.cover_infos_global > .cover_infos_title > a@href | trim',
            quality: '.detail_release span@text | trim',
//             lang: '.detail_release span:nth-child(2)@text | trim',
//             genre: '.cover_infos_genre@text | trim',
//             year: '.cover_infos_release_date@text | trim',
            imageUrl: '.mainimg@src | trim'
        }])
            .paginate('.navigation > a:contains(Suivant)@href')
            .limit(pageLimit));
    };

    static getDetails(url) {
        if (url.indexOf('telecharger-series') > -1) {
			return Promise.fromCallback(x(url, '.corps', {
				links: ['b > a:contains(Episode)@href']
			}))
			.then(r => {
				console.log(r)
// 				r.links = r.links.map(l => decryptDlProtecteUrl(l.replace('\r', '')));
				return r;
			});
		} else {
			return Promise.fromCallback(x(url, '.corps', {
				links: ['b > a:contains(Télécharger)@href']
			}))
			.then(r => {
				console.log(r)
// 				r.links = r.links.map(l => decryptDlProtecteUrl(l.replace('\r', '')));
				return r;
			});
		}
    };
}
