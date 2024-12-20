// // login.js
// async function login(event) {
//     event.preventDefault();  // Prevent default form submission

//     // Get the values from the form
//     let email = document.getElementById('email').value;
//     let password = document.getElementById("pass").value;

//     let loginData = { email, password };
//     console.log("Login data:", loginData);

//     // Convert data to JSON
//     let jsonData = JSON.stringify(loginData);

//     try {
//         // Make the POST request to the backend API (adjust URL as necessary)
//         let response = await fetch("http://localhost:3004/admin/login", {
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: jsonData
//         });

//         // Check if the response is OK (status code 2xx)
//         if (response.ok) {
//             let parsedResponse = await response.json();
//             console.log("Parsed response:", parsedResponse);

//             // Get the token from the response
//             let token = parsedResponse.data.token;
//             console.log("Token received:", token);

//             // Save the token in localStorage (you can also use cookies for better security)
//             localStorage.setItem('authToken', token);

//             // Show a success alert and redirect the user
//             alert(parsedResponse.message);

//             // Redirect user based on their role or type
//             let user_type = parsedResponse.data.user_type;  // Ensure this is correctly returned from backend
//             if (user_type === "admin") {
//                 window.location.href = "adminpage.html";  // Admin page
//             } else if (user_type === "buyer") {
//                 window.location.href = "getallproducts.html";  // User's dashboard
//             }

//         } else {
//             // Handle unsuccessful response (non-2xx status codes)
//             let parsedResponse = await response.json();
//             console.log("Error message:", parsedResponse.message);
//             alert(parsedResponse.message);  // Show error message
//         }

//     } catch (error) {
//         // Catch network errors or unexpected errors
//         console.error("Network error:", error);
//         alert("An error occurred while trying to login. Please try again.");
//     }
// }

// // Attach the login function to the form's submit event
// document.getElementById('login-form').addEventListener('submit', login);

async function login(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let password = document.getElementById("pass").value;

    let datas = {
        email,
        password
    }

    console.log("datas from login :", datas);
    let json_data = JSON.stringify(datas);

    try {
        // Make the POST request to the server
        let response = await fetch("http://localhost:3004/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: json_data
        });


        // Check if response is OK (status code 2xx)
        if (response.ok) {
            let parsed_response = await response.json();
            console.log("parsed_response:", parsed_response);

            // Get user data and token
            let data = parsed_response.data;
            let token = parsed_response.data.token;
            console.log("data:", data);
            console.log("token:", token);

            // Save token to localStorage
            localStorage.setItem('authToken', token);

            let user_type = data.user_type;
            console.log("user_type:", user_type);

            // Show the alert first
            alert(parsed_response.message);

// Check user type and redirect accordingly
if (user_type === "6744900ea12e7f377187c840") {
    window.location.href = "adminpage.html";  // Admin page
} else if (user_type === "6744904aa12e7f377187c841") {
    window.location.href = "seller.html";  // Add product page
} else {
    window.location.href = "getallproducts.html";  // Default page for other users
}


        } else {
            // Handle unsuccessful response (non-2xx status codes)
            let parsed_response = await response.json();
            console.log("Error message:", parsed_response.message);
            alert(parsed_response.message);  // Show error message
        }
    } catch (error) {
        // Catch network errors
        console.error("Network error:", error);
        alert("An error occurred while trying to login. Please try again.");
    }
}

async function getAllProducts() {
    try {
        let response = await fetch(`/getallproducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            let parsed_response = await response.json();
            console.log("parsed_response", parsed_response);

            let data = parsed_response.data; // Ensure data is an array
            console.log("data", data);

            if (!Array.isArray(data)) {
                console.error('Data is not an array:', data);
                return;
            }

            let productsContainer = document.getElementById('productsContainer');
            if (!productsContainer) {
                console.error('Element with id "productsContainer" not found.');
                return;
            }

            let productData = '';

            for (let i = 0; i < data.length; i++) {
                let product = data[i];
                let imageUrl = product.image || ''; // Fix the image URL extraction
                let name = product.name || 'Unnamed Product';
                let price = product.price || '0.00';

                productData += `
                    <div class="pt-5">
                        <div class="card" style="width: 18rem; height:370px;">
                            <img src="${imageUrl}" class="card-img-top" alt="Product Image" style="width: 286.4px; height:219px;">
                            <div class="card-body">
                                <h5 class="card-title">${name.slice(0, 50)}</h5>
                                <span>Price: $${price}</span>
                                <div class="button" style="margin-top:10px">
                                    <button type="button" class="btn">Add To Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            productsContainer.innerHTML = productData;

        } else {
            console.error('Failed to fetch products. Status:', response.status);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


async function addProduct(event) {
    event.preventDefault();

    let params = new URLSearchParams(window.location.search);
    let token_key = params.get('login');
    let token = localStorage.getItem(token_key);
    let id = params.get('id');
    console.log("id", id);

    // Get the product details
    let name = document.getElementById('name').value.trim();
    let price = parseFloat(document.getElementById('price').value);

    let images = document.getElementById('imagesUpload');

    // Validate price
    if (price <= 0) {
        alert("Price must be a positive number.");
        return;
    }

    // Check if files are selected
    const imageFiles = images.files;
    console.log("imageFiles", imageFiles);

    if (imageFiles.length === 0) {
        alert("Please upload at least one image.");
        return;
    }

    // Validate file types
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    for (let i = 0; i < imageFiles.length; i++) {
        if (!validImageTypes.includes(imageFiles[i].type)) {
            alert(`File type not supported: ${imageFiles[i].name}. Please upload JPEG, PNG, or GIF images.`);
            return;
        }
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);

    // Loop through the image files and append them to FormData
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images[]', imageFiles[i]); // Use 'images[]' if your backend expects an array
    }

    console.log("formData", formData);

    try {
        // Make the POST request to the server
        let response = await fetch(`/addproduct`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        console.log("response", response);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error('Error: ' + errorResponse.message || 'Network response was not ok');
        }

        let parsedResponse = await response.json();
        console.log("parsedResponse", parsedResponse);

        alert("Product added successfully!");

        // Redirect back to the products list
        window.location.href = `getallproducts.html?login=${token_key}&id=${id}`;
    } catch (error) {
        console.log("error", error);
        alert("There was an error adding the product. Please try again.");
    }
}
