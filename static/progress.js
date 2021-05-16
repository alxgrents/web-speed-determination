export async function updateProgressbar(){
    $.ajax({
        url: globalThis.progressLink,
        success: function(data){
            $("#detectionProgressbar").css("width", data.currentFrame/data.frameCount);
            $("#detectionProgressbar").text(Math.round(data.currentFrame/data.frameCount, 2));
        }
    })

    $("#detectionProgressbar")
}

export class ProgressManager {
    constructor (processId) {
        this._processId = processId

        this._progressHtml = $("#detectionProgressbar");
        this._progressText = $("#progress-text");
    }

    start () {
        $.ajax({
            url: globalThis.progressLink + this._processId,
            type: "GET",
            processData: false,
            contentType: false,
            success: this.update.bind(this)
        });
    }

    update (data) {
        if (data.status === 'end') {
            return this.stop(data);
        }

        this.updateHtml(data);

        setTimeout(() => {
            $.ajax({
                url: globalThis.progressLink + this._processId,
                type: "GET",
                processData: false,
                contentType: false,
                success: this.update.bind(this)
            });
        }, 2000);
    }

    /**
     *
     * @param {Object} data
     * @param data.webm
     */
    stop (data) {
        $("#result").show();
        this._progressHtml.hide();
        $("#result-video").attr('src', `./file/${data.webm}`)
        console.log('stop', data)
    }

    /**
     * @param {Object} data
     * @param data.currentFrame
     * @param data.frameCount
     */
    updateHtml (data) {
        const p = Math.floor(100 * data.currentFrame / data.frameCount);
        this._progressHtml.css("width", p + '%');
        this._progressHtml.text(p + '%');

        this._progressText.text(`${data.currentFrame} / ${data.frameCount}`);
    }
}