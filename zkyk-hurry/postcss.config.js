
module.exports = {
    plugins : [ require('autoprefixer')({
        "overrideBrowserslist" : [
            "defaults",
            "Android 4",
            "iOS 7",
            "not ie < 10",
            "last 4 version"
        ]
    }) ]
}