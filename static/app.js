import {
    getFormData,
    showUploadImage,
    setVideoFileUrl,
} from "./video.js";
import {
    init,
    update,
} from "./init.js";
import {
    ROADS,
    VIDEO_FILES,
} from "./enums.js";

init();

videoFile.change(setVideoFileUrl);
maskFile.change(function(){showUploadImage(this, "#mask-view")});

videoSelect.change(function() {
    if (this.value === "custom") {
        $("#video-form").show();
        setVideoFileUrl();
    }
    else $("#video-form").hide();

    if (this.value === ROADS.KOMPOL) setVideoFileUrl(VIDEO_FILES.KOMPOL, "video/mp4")
});

sendVideoForm.submit(function(e){
    e.preventDefault();

    let body = getFormData();
    if (!body) return;

    $.ajax({
        url: globalThis.serverLink,
        type: "POST",
        data: body,
        processData: false,
        contentType: false,
        success: function(data){
            sendVideoForm.hide();

            progressManager.init(data.id);
            progressManager.start();
        }
    });

    return false;
});

update();

const procId = cookieArray.find(([key, value]) => key === 'process_id' && value != 0)

if (procId) {
    progressManager.init(procId);
    progressManager.start();
}