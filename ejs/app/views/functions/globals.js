// modes: development / production
let mode = "development";

let globals = {
	basePathPages: function () {
		switch (mode) {
			case "production":
				return "../";

			case "development":
				return "../../../";
		}
	},
	basePathComponents: function () {
		switch (mode) {
			case "production":
				return "../../";

			case "development":
				return "../../../../../";
		}
	},
	navigation: function (lang, file) {
		switch (mode) {
			case "production":
                return `./pages/${file}.html`;
			case "development":
				return `./output/${lang}/pages/${file}.html`;
		} 
	},
    getMedia: function (lang, file, mediaType){
		if(lang == null){
			return `./assets/media/${mediaType}/${file}`;
		}
		else{
			switch (mode) {
				case "production":
					return `./assets/media/${mediaType}/${file}`;
				case "development":
					return `./assets/media/${mediaType}/${lang}/${file}`;
			}
		}
    },
};

export default globals;