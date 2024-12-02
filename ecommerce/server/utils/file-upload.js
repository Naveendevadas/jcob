const dayjs = require('dayjs');
const fs = require('fs');

exports.fileUpload = async function (file, directory) {
    console.log("fileUpload function executed");

    return new Promise((resolve, reject) => {
        try {
            // Extract mime type from the file string (base64)
            let mime_type = "";
            if (file.includes(":") && file.includes("/")) {
                mime_type = file.split(";")[0].split(":")[1].split("/")[1];
            }
            console.log("mime_type:", mime_type);

            // Check if the file type is allowed
            if (mime_type === 'png' || mime_type === 'jpg' || mime_type === 'jpeg' || mime_type === 'mp4' || mime_type === 'pdf') {
                console.log("File type allowed..");

                // Generate a unique file name with dayjs and a random number
                let file_name = `${dayjs().format('YYYY-MM-DD_HH-mm-ss')}_${Math.floor(Math.random() * 100)}.${mime_type}`;
                console.log("file_name:", file_name);

                let upload_path = `upload/${directory}`;
                console.log("upload_path:", upload_path);

                // Get the base64 content of the file
                let base64 = file.split(';base64,')[1];

                // Create the upload directory if it doesn't exist
                fs.mkdir(upload_path, { recursive: true }, (err) => {
                    if (err) {
                        console.log("Error creating directory:", err);
                        reject(err.message || err);
                    } else {
                        // Define the final path where the file will be saved
                        let file_upload_path = `${upload_path}/${file_name}`;
                        console.log("file_upload_path:", file_upload_path);

                        // Write the file to the disk
                        fs.writeFile(file_upload_path, base64, { encoding: 'base64' }, (err) => {
                            if (err) {
                                console.log("Error writing file:", err);
                                reject(err.message || err);
                            } else {
                                resolve(file_upload_path); // Return the file path upon success
                            }
                        });
                    }
                });

            } else {
                // Invalid file type
                console.log("Invalid file type");
                reject("Only .png, .jpeg, .jpg, .mp4, and .pdf are allowed");
            }
        } catch (error) {
            console.log("Error:", error);
            reject(error.message || error);
        }
    });
};
