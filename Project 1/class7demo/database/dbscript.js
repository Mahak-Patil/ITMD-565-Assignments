(function($){
	//console.log('js loaded....');
	var db;

	var openRequest = indexedDB.open("wordlist",1);
	openRequest.onupgradeneeded = function(e) {
		console.log("Upgrading DB...");
		var thisDB = e.target.result;
		if(!thisDB.objectStoreNames.contains("wordliststore")) {
			thisDB.createObjectStore("wordliststore", { autoIncrement : true });
		}
	}
	openRequest.onsuccess = function(e) {
		console.log("Open Success!");
		db = e.target.result;
		document.getElementById('add-btn').addEventListener('click', function(){
			var text = document.getElementById('text-in').value;
			if (!text.trim()) {
        		//empty
        	} else {
        		addWord(text);
        	}
        });
        renderList();
	}
	openRequest.onerror = function(e) {
		console.log("Open Error!");
		console.dir(e);
	}

	function addWord(t) {
		console.log('adding ' + t);
		var transaction = db.transaction(["wordliststore"],"readwrite");
		var store = transaction.objectStore("wordliststore");
		var request = store.add({text: t});
		request.onerror = function(e) {
			console.log("Error",e.target.error.name);
	        //some type of error handler
	    }
	    request.onsuccess = function(e) {
	    	console.log("added " + t);
	    	renderList();
	    	document.getElementById('text-in').value = '';
	    }
	}

	function renderList(){
		$('#list-wrapper').empty();
		$('#list-wrapper').html('<table><tr><th>Key</th><th>Text</th></tr></table>');

		//Count Objects
		var transaction = db.transaction(['wordliststore'], 'readonly');
		var store = transaction.objectStore('wordliststore');
		var countRequest = store.count();
		countRequest.onsuccess = function(){ console.log(countRequest.result) };

		// Get all Objects
		var objectStore = db.transaction("wordliststore").objectStore("wordliststore");
		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				var $link = $('<a href="#" data-key="' + cursor.key + '">' + cursor.value.text + '</a>');
				$link.click(function(){
					//alert('Clicked ' + $(this).attr('data-key'));
					loadTextByKey(parseInt($(this).attr('data-key')));
				});
				var $row = $('<tr>');
				var $keyCell = $('<td>' + cursor.key + '</td>');
				var $textCell = $('<td></td>').append($link);
				$row.append($keyCell);
				$row.append($textCell);
				$('#list-wrapper table').append($row);
				cursor.continue();
			}
			else {
			    //no more entries
			}
		};
	}

	function loadTextByKey(key){
		var transaction = db.transaction(['wordliststore'], 'readonly');
		var store = transaction.objectStore('wordliststore');
		var request = store.get(key);
		request.onerror = function(event) {
		  // Handle errors!
		};
		request.onsuccess = function(event) {
		  // Do something with the request.result!
		  $('#detail').html('<h2>' + request.result.text + '</h2>');
		  var $delBtn = $('<button>Delete me</button>');
		  $delBtn.click(function(){
		  	console.log('Delete ' + key);
		  	deleteWord(key);
		  });
		  $('#detail').append($delBtn);
		};
	}

	function deleteWord(key) {
		var transaction = db.transaction(['wordliststore'], 'readwrite');
		var store = transaction.objectStore('wordliststore');
		var request = store.delete(key);
		request.onsuccess = function(evt){
			renderList();
			$('#detail').empty();
		};
	}






})(jQuery);