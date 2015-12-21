/**
 * Buddyexpress Desk
 *
 * @package   Bdesk
 * @author    Buddyexpress Core Team <admin@buddyexpress.net
 * @copyright 2014 BUDDYEXPRESS NETWORKS.
 * @license   Buddyexpress Public License http://www.buddyexpress.net/Licences/bpl/ 
 * @link      http://labs.buddyexpress.net/bdesk.b
 */
/**
 * Note: for this to work properly you need to set up your tinymce 4 init script so it does not upload files
 * but rather tries to keep its original base64 format.
 * To do so insert the following lines into tinymce.init:
 *     paste_data_images: true,
 *     images_upload_handler: function (blobInfo, success, failure) {
 *       // no upload, just return the blobInfo.blob() as base64 data
 *       success("data:" + blobInfo.blob().type + ";base64," + blobInfo.base64());
 *     }
 */
tinymce.PluginManager.add("bdesk_photo", function(editor, f) {
	editor.addCommand("bdesk_photo", function() {
		editor.windowManager.open({
			title: "Insert embedded image",
			width: 450,
			height: 80,
			html: '<input type="file" class="input" name="single-image" style="font-size:14px;padding:30px;" accept="image/png, image/gif, image/jpeg, image/jpg"/>',
			buttons: [{
				text: "Ok",
				subtype: "primary",
				onclick: function() {
					if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
						alert("This feature needs a modern browser.");
						(this).parent().parent().close();
						return;
					}

					var imagefile = document.getElementsByName("single-image")[0].files;

					if (imagefile.length <= 0) {
						// do nothing
						(this).parent().parent().close();
						return;
					}

					if (imagefile[0].size > 512 * 1024) {
						alert("The image cannot be larger than 500KB.");
						return;
					}

					var thisOne = this;

					var classFilereader = new FileReader();
					classFilereader.onload = function(base64) {
						var imgData = base64.target.result;
						var img = new Image();
						img.src = imgData;

						editor.execCommand("mceInsertContent", false, "<img src='" + imgData + "' />");
						thisOne.parent().parent().close();
					};

					classFilereader.onerror = function(err) {
						alert("Error reading file - " + err.getMessage());
					};

					classFilereader.readAsDataURL(imagefile[0]);
				}
			}, {
				text: "Cancel",
				onclick: function() {
					(this).parent().parent().close();
				}
			}]
		});
	});

	editor.addButton("bdesk_photo", {
		icon: "image",
		context: "insert",
		title: "Insert embedded image",
		cmd: "bdesk_photo"
	});

	editor.addMenuItem("bdesk_photo", {
		cmd: "bdesk_photo",
		context: "insert",
		text: "Insert embedded image",
		icon: "image",
		prependToContext: true
	});
});
