/*
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var parseQueryString = function() {
	var queryString = window.location.search;
	return parseQuery(queryString);
};

var parseQuery = function(queryString) {
	var qRe = new RegExp("\\?q=([^&]+)|&q=([^&]+)");
	var results = qRe.exec(queryString) || [ "", "" ];
	return results[1] || results[2];
};

var parseHashString = function() {
	var queryString = window.location.hash;
	return parseQuery(queryString);
};

var query = parseQueryString();

window.addEventListener("hashchange", function() {
	// The Hash has changed, the user is probably doing a search so lets do a
	// search ourselves
	query = parseHashString();
	searchAndroidMarket(query, function(data) {
		var container = document.querySelector("#ires ol li");

		container.insertBefore(createAndroidMarketBox(data));
	});
});

var searchAndroidMarket = function(query, callback) {
	chrome.extension.sendRequest({
		"q" : query
	}, callback);
};

var createAndroidMarketBox = function(data) {
	if (data.results.length == 0)
		return;

	var box = document.createElement("li");
	var boxContainer = document.createElement("div");
	boxContainer.id = "androidmarket_results__";

	var header = document.createElement("h3");
	var searchLink = document.createElement("a");
	searchLink.textContent = "Android app results for " + query;
	searchLink.target = "_blank";
	searchLink.href = "https://market.android.com/search?q=" + encodeURI(query);

	header.appendChild(searchLink);
	header.style.display = "block";

	boxContainer.appendChild(header);

	// Itterate over the results
	for ( var result in data.results) {
		var resultBox = createResult(data.results[result]);
		boxContainer.appendChild(resultBox);
	}

	boxContainer.appendChild(document.createElement("br"));

	box.appendChild(boxContainer);
	return box;
};

var createResult = function(result) {
	var c = document.createElement("div");

	var a = document.createElement("a");
	var img = document.createElement("img");
	var title = document.createElement("span");
	var category = document.createElement("span");
	var developer = document.createElement("span");
	var price = document.createElement("span");

	a.href = result.href;
	a.target = "_blank";
	a.title = result.title;

	img.src = result.img;
	img.alt = result.title;
	img.width = 78;
	img.height = 78;

	try {
		title.innerText = result.title.replace("&amp;", "&");
	} catch (e) {
		// TODO: handle exception
	}

	try {
		category.innerText = result.category.replace("&amp;", "&");
	} catch (e) {
		// TODO: handle exception
	}

	try {
		developer.innerText = result.developer.replace("&amp;", "&");
	} catch (e) {
		// TODO: handle exception
	}
	price.innerText = result.price;
	a.appendChild(img);

	c.appendChild(a);
	c.appendChild(title);
	c.appendChild(category);
	c.appendChild(developer);

	// c.appendChild(price);

	return c;
};

searchAndroidMarket(query, function(data) {
	var container = document.querySelector("#ires ol li");

	container.insertBefore(createAndroidMarketBox(data));
});