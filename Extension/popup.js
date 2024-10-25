document.getElementById("scrape-btn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: scrapeProduct,
      },
      (result) => {
        if (result && result[0] && result[0].result) {
          const product = result[0].result;
  
          document.getElementById("product-name").textContent = product.name;
          document.getElementById("product-price").textContent = product.price;
          document.getElementById("product-id").textContent = product.productId;
          document.getElementById("product-image").src = product.imageUrl;
          document.getElementById("product-rating").textContent = product.rating;  
          document.getElementById("product-description").textContent = product.description;  
          document.getElementById("product-breadcrumbs").textContent = product.breadcrumbs.join(" > ");  
  
          document.getElementById("product-info").style.display = "block";
        } else {
          alert("Unable to scrape product data. Please check the page.");
        }
      }
    );
});
  
function scrapeProduct() {
    const productName = document.getElementById("productTitle")?.innerText.trim();
   
    const priceElement = document.querySelector('.a-price .a-offscreen');
    let productPrice = priceElement ? priceElement.innerText.trim() : "N/A";
  
    const productImageUrl = document.getElementById("imgTagWrapperId")?.getElementsByTagName("img")[0]?.src;
   
    const url = window.location.href;
    const productIdMatch = url.match(/\/dp\/([A-Z0-9]+)/);
    const productId = productIdMatch ? productIdMatch[1] : null;
 
    const ratingElement = document.getElementById("acrPopover");
    const productRating = ratingElement ? ratingElement.getAttribute("title").split(" ")[0] : "N/A";
   
    const descriptionElement = document.getElementById("productDescription") || document.querySelector('#feature-bullets ul');
    const productDescription = descriptionElement ? descriptionElement.innerText.trim() : "Description not available";
   
    // const breadcrumbElements = document.querySelectorAll('#wayfinding-breadcrumbs_feature_div ul li a');
    // const breadcrumbs = Array.from(breadcrumbElements).map(el => el.innerText.trim());
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
      name: productName,
      price: productPrice,
      imageUrl: productImageUrl,
      productId: productId,
      rating: productRating,  
      description: productDescription,  
      breadcrumbs: updatedBreadcrumbs
    };
}
