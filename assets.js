/**
 * Created by httpnick on 1/15/15.
 */
function Assets() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
}

Assets.prototype.queueDownload = function (path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
}

Assets.prototype.isDone = function() {
    return this.downloadQueue.length === this.successCount + this.errorCount;
}

Assets.prototype.downloadAll = function(callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var img = new Image();
        var that = this;

        var path = this.downloadQueue[i];
        console.log(path);

        img.addEventListener("load", function () {
            console.log("Loaded " + this.src);
            that.successCount++;
            if (that.isDone()) callback();
        });

        img.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        img.src = path;
        this.cache[path] = img;
    }
}

    Assets.prototype.getAsset = function (path) {
        return this.cache[path];
    }