chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SAVE_PRODUCT_DETAILS") {
      const productDetails = message.productDetails;
      console.log("am here in the background script sending data to nodeapi")
      console.log("Received Product Details:", productDetails);
      
       fetch("http://localhost:5000/api/saveProductDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productDetails.productId,
          name: productDetails.name,
          price: productDetails.price,
          imageUrl: productDetails.imageUrl,
          rating: productDetails.rating,      
          description: productDetails.description,  
          breadcrumbs: productDetails.breadcrumbs,  
          siteId: productDetails.siteId,  
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Product details saved:", data);
        })
        .catch((error) => {
          console.error("Error saving product details:", error);
        });
    }
});
