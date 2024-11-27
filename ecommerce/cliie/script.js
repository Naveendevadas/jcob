// async function buyerData() {
//     let params = new URLSearchParams(window.location.search);

//     let id = params.get('id');

//     try {
//         let response = await fetch(`/user/${id}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },

//         });
//         console.log("response", response);

//         let parsed_response = await response.json();
//         console.log("parsed_Response", parsed_response);

//         let data = parsed_response.data;
//         console.log('data', data);

//         let username = document.getElementById('username');

//         let usernamedata = ''
//         usernamedata += `
//         <div class="px-5 pt-3 fs-3">${data.name}</div>
//         `
//         username.innerHTML = usernamedata
//         console.log("username", usernamedata)
//     } catch (error) {
//         console.log("error", error);
//     }
// }

async function getAllProducts() {
    try {
        let response = await fetch(`/getProducts`, { method: 'GET' });
        console.log("response", response);

        if (response.status === 200) {
            let parsed_response = await response.json();
            console.log("parsed_response", parsed_response);

            let data = parsed_response.data;
            console.log("data", data);

            let productsContainer = document.getElementById('productsContainer');

            let productData = ''

            for (let i = 0; i < data.length; i++) {
                // Get URLs for first and second images if available
                let firstImageUrl = data[i].images && data[i].images[0] ? data[i].images[0].url : '';
                let secondImageUrl = data[i].images && data[i].images[1] ? data[i].images[1].url : '';

                // Only include the second image if it's available
                productData += `<div class="box-alignment shadow-lg mb-5 bg-body-tertiary" style="border-radius: 20px;">
                <div class="image-container">
                    <!-- First image is initially visible -->
                    <img src="${firstImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">
                    
                    <!-- Second image is initially hidden and shown on hover if it exists -->
                    ${secondImageUrl ? `<img src="${secondImageUrl}" class="imagehover" style="height: 300px; width: 100%; border-radius: 20px 20px 0px 0px;">` : ''}
                </div>   
                <div class="px-3 pt-4">${data[i].name.slice(0, 10) + ".."}</div>
                <div class="text-danger px-3 pb-4">$${data[i].price}</div>
                <div>
                    <button class="px-3" onclick="handleaddtocart('${data[i]._id}', event, ${data[i].price})">Add to cart</button>
                </div>
              </div>
            `;
        }

            productsContainer.innerHTML = productData;
        }
    } catch (error) {
        console.log('error', error);
    }
}