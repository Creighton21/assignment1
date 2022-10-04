function test_print(){

         console.log(“test code”)

}

$(function () {
  /*
  Get the all users information and display them in a table
  The user information includes: Users ID, Screen name, and Name
  */
  $("#get-button").on("click", function () {
    /*
    Request the user information from backend
    Upon success create a table with each row being a users information and 
    the columns displaying ID, Screen name, and Name respectively.
    */
    $.ajax({
      url: "/tweets",
      contentType: "application/json",
      success: function (response) {
        var uBody = $("#namebody");
        uBody.html("");

        response.forEach((element, index) => {
          uBody.append(
            "\
          <tr>\
          <td class='id' >" +
              element.id +
              "</td>\
          <td>\
          <input type='text' id='US" +
              index +
              "'></input>\
              </td>\
          <td>\
          <input type='text' id='U" +
              index +
              "'></input>\
              </td>\
          </tr>\
          "
          );
          // Set the values of the input fields to the Screen name and the Name respectively
          document
            .getElementById(`US${index}`)
            .setAttribute("value", element.screen_name);
          document
            .getElementById(`U${index}`)
            .setAttribute("value", element.name);
        });
      },
    });
  });

  /*
  Get all the tweets and display them in a table
  The information included is the following:
  Tweet ID, Text, and Created_at time
  */
  $("#get-tweets-button").on("click", function () {
    /*
    Request the tweet information from backend.
    Upon success create a table with each row being a tweets information and 
    the columns displaying ID, Text, and Created_at time respectively.
    */
    $.ajax({
      url: "/tweetinfo",
      contentType: "application/json",
      success: function (response) {
        var tBody = $("#tweetbody");
        tBody.html("");

        //console.log(response);
        response.forEach((element, index) => {
          tBody.append(
            "\
          <tr>\
          <td class='id' >" +
              element.id +
              "</td>\
              <td>\
              <input type='text' id='V" +
              index +
              "'></input>\
              </td>\
          <td class='date' >\
          <input type='text' id='D" +
              index +
              "'></input>\
              </td>\
          </tr>\
          "
          );
          // Set the values of the input fields to the Text and the Created_at time respectively
          document
            .getElementById(`V${index}`)
            .setAttribute("value", element.text);

          document
            .getElementById(`D${index}`)
            .setAttribute("value", element.date);
        });
      },
    });
  });

  /*
  Get the recently searched tweets and display them in a table.
  The information displayed is Tweet ID, Text, and Created_at time
  */
  $("#get-searched-tweets").on("click", function () {
    /*
    Request the recent tweet information from backend.
    Upon success create a table with each row being a tweets information and 
    the columns displaying ID, Text, and Created_at time respectively.
    */
    $.ajax({
      url: "/searchinfo",
      contentType: "application/json",
      success: function (response) {
        var vBody = $("#searchbody");
        vBody.html("");

        response.forEach((element, index) => {
          vBody.append(
            "\
          <tr>\
          <td class='id' >" +
              element.id +
              "</td>\
              <td>\
              <input type='text' id='R" +
              index +
              "'></input>\
              </td>\
          <td class='date' >\
          <input type='text' id='DS" +
              index +
              "'></input>\
              </td>\
          </tr>\
          "
          );
          // Set the values of the input fields to the Text and the Created_at time respectively
          document
            .getElementById(`R${index}`)
            .setAttribute("value", element.text);
          document
            .getElementById(`DS${index}`)
            .setAttribute("value", element.date);
        });
      },
    });
  });

  /*
  Create a new tweet and POST it.
  The information to create a tweet is Tweet ID and Text
  The information is given as ID;Text
  */
  $("#create-form").on("submit", function (event) {
    event.preventDefault();

    var createInput = $("#create-input");

    if (createInput.val().indexOf(";") != -1) {
      var newTweet = createInput.val().split(";");

      /*
    POST request the new tweet to the backend.
    Upon success click the get tweet button to display the table with the new tweet
    */
      $.ajax({
        url: "/tweetinfo",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          tweetId: newTweet[0],
          text: newTweet[1],
        }),
        success: function (response) {
          createInput.val("");
          $("#get-tweets-button").click();
          console.log(response);
        },
      });
    } else {
      alert("Please format the tweet as seen above the input field");
    }
  });

  /*
  Search for a tweet via its tweet ID and POST that tweet as recently searched.
  Display the searched tweet in a table.
  The information displayed is the Tweet ID, Text, and Created_at time
  */
  $("#search-form").on("submit", function (event) {
    event.preventDefault();
    var userID = $("#search-input");

    /*
    POST request the searched tweet to the backends recently searched and retrieve 
    the searched tweet.
    Upon success create a table with the columns displaying ID, Text, and Created_at time 
    respectively.
    */

    $.ajax({
      url: "/searchinfo",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ tweetId: userID.val() }),
      success: function (response) {
        userID.val("");
        var index = 1;

        var sBody = $("#searchbody");
        sBody.html("");

        sBody.append(
          "\
          <tr>\
          <td class='id' >" +
            response.id +
            "</td>\
              <td>\
              <input type='text' id='S" +
            index +
            "'></input>\
              </td>\
          <td class='date' >\
          <input type='text' id='DO" +
            index +
            "'></input>\
            </td>\
          </tr>\
          "
        );
        // Set the values of the input fields to the Text and the Created_at time respectively
        document
          .getElementById(`S${index}`)
          .setAttribute("value", response.text);

        document
          .getElementById(`DO${index}`)
          .setAttribute("value", response.date);
      },
      error: function (response) {
        userID.val("");
        alert("Enter a valid id.");
      },
    });
  });

  /*
  Update a users screen name with the following information:
  Name;newScreenName
  The name of the user Name and the newScreenName to update to.
  */
  $("#update-user").on("submit", function (event) {
    event.preventDefault();
    var updateInput = $("#update-input");
    var inputString = updateInput.val();

    if (inputString.indexOf(";") != -1) {
      const parsedStrings = inputString.split(";");

      var name = parsedStrings[0];
      var newName = parsedStrings[1];

      /*
    PUT request the users new Screen name to the backend
    Upon success click the get-button to display the user table with the updated user
    */
      $.ajax({
        url: "/tweets/:nm",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ name: name, newName: newName }),
        success: function (response) {
          updateInput.val("");
          $("#get-button").click();
          console.log(response);
        },
        error: function (response) {
          updateInput.val("");
          alert("Enter a valid name.");
        },
      });
    } else {
      alert("Please format the update as seen above the input field");
    }
  });

  /*
  Delete a tweet via the tweet ID
  */
  $("#delete-form").on("submit", function (event) {
    var id = $("#delete-input");
    event.preventDefault();
    var delID = id.val();

    /*
    DELETE request the specified tweet from the backend.
    Upon success click the get tweet button to display the tweet table showing that 
    the tweet is no longer there.
    */
    $.ajax({
      url: "/tweetinfo/:tweetid",
      method: "DELETE",
      contentType: "application/json",
      data: JSON.stringify({ id: delID }),
      success: function (response) {
        id.val("");
        $("#get-tweets-button").click();
        console.log(response);
      },
      error: function (response) {
        id.val("");
        alert("Enter a valid id.");
      },
    });
  });
});
