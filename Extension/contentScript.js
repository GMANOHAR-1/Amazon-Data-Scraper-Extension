(() => {
    const extractProductDetails = () => {
        const productName = document.getElementById("productTitle")?.innerText.trim();
        const priceElement = document.querySelector('.a-price .a-offscreen');
        let productPrice = priceElement ? priceElement.innerText.trim() : "N/A";
        const productImageUrl = document.getElementById("imgTagWrapperId")?.getElementsByTagName("img")[0]?.src;
        const productUrl = window.location.href;
        const productIdMatch = productUrl.match(/\/dp\/([A-Za-z0-9]+)/);
        const productId = productIdMatch ? productIdMatch[1] : null;
        const ratingElement = document.getElementById("acrPopover");
        const productRating = ratingElement ? ratingElement.getAttribute("title").split(" ")[0] : "N/A";
        const descriptionElement = document.getElementById("productDescription") || document.querySelector('#feature-bullets ul');
        const productDescription = descriptionElement ? descriptionElement.innerText.trim() : "Description not available";
        const breadcrumbElements = document.querySelectorAll('#wayfinding-breadcrumbs_feature_div ul li a');
        const breadcrumbs = Array.from(breadcrumbElements).map(el => el.innerText.trim());

        let searchTerm = "N/A";
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('keywords')) {
            searchTerm = decodeURIComponent(urlParams.get('keywords').replace(/\+/g, " "));
        }

        const updatedBreadcrumbs = breadcrumbs.map(crumb => 
            crumb.includes("Back to results") ? searchTerm : crumb
        );

        return {
            productId: productId,
            name: productName,
            price: productPrice,
            imageUrl: productImageUrl,
            rating: productRating,
            description: productDescription,
            breadcrumbs: updatedBreadcrumbs,
            siteId: "amazon.com",
        };
    };

    const sendProductDetails = () => {
        const productDetails = extractProductDetails();
        
        if (productDetails.productId) {
            chrome.runtime.sendMessage({
                type: "SAVE_PRODUCT_DETAILS",
                productDetails: productDetails,
            });
        } else {
            console.log("Product ID not found.");
        }
    };

    sendProductDetails();
})();
