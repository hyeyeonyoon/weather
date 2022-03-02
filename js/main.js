$(document).ready(function(){

  const cityName = []; // 버튼클릭 또는 검색바에 입력하는 순간 데이터(도시명) 수집
  console.log(cityName);

  let state_icon = ""; // 텍스트화 된 날씨 -> 이미지로 변경하기 위한 변수

  const w_box = `
    <li>
      <div class="top">
        <div class="cur_icon">
          <i class="wi"></i>
        </div>
        <div class="info">
          <p class="temp"><span class="degree">12</span>&nbsp;℃</p>
          <p class="interTemp">
            최저<span class="temp_min"></span>℃ / 
            최고<span class="temp_max"></span>℃
          </p>
          <h4></h4>
          <p class="location"><span class="city"></span>, <span class="nation"></span></p>
        </div>
      </div>
      <div class="bottom">
        <div class="wind">
          <i class="wi wi-strong-wind"></i>
          <p><span></span>&nbsp;m/s</p>
        </div>
        <div class="humidity">
          <i class="wi wi-humidity"></i>
          <p><span></span>&nbsp;%</p>
        </div>
        <div class="cloud">
          <i class="wi wi-cloud"></i>
          <p><span></span>&nbsp;%</p>
        </div>
      </div>
    </li>
  `;

  function w_info(){
    $("#weather ul").empty();

    // cityName 을 기준으로 반복하여 w_box 넣는다
    for(v of cityName){
      $("#weather ul").append(w_box);
    }

    $("#weather li").each(function(index){

      // const $index = $(this).index();
      // console.log($index);

      $.ajax({
        url : `https://api.openweathermap.org/data/2.5/weather?q=${cityName[index]}&appid=9857b03efd38c0fff9aaeb05ee8ee56b`,
        dataType : "json",
        success : function(data){
          //console.log(data);

          const weather = data.weather[0].main;
          //console.log("현재 날씨 : " + weather); //Clouds

          const temp = Math.round(data.main.temp - 273.15);
          //console.log("현재 온도 : " + temp); //-4

          const min_temp = Math.round(data.main.temp_min - 273.15);
          //console.log("최저 온도 : " + min_temp); //-5

          const max_temp = Math.round(data.main.temp_max - 273.15);
          //console.log("최고 온도 : " + max_temp); //-1

          const city = data.name;
          //console.log("도시명 : " + city);

          const nation = data.sys.country;
          //console.log("국가명 : " + nation);

          const wind = data.wind.speed;
          //console.log("현재 풍속 : " + wind);

          const humidity = data.main.humidity;
          //console.log("현재 습도 : " + humidity);

          const cloud = data.clouds.all;
          //console.log("구름 양 : " + cloud);


          // 텍스트화된 날씨(변수명 : weather) 정보를 아이콘으로 변경
          if(weather == "Clear") state_icon = "wi-day-sunny";
          else if(weather == "Clouds") state_icon = "wi-cloud";
          else if(weather == "Rain") state_icon = "wi-rain";
          else if(weather == "Snow") state_icon = "wi-snow";
          else if(weather == "Mist") state_icon = "wi-fog";

          $("#weather li").eq(index).find(".cur_icon i").addClass(state_icon);
          $("#weather li").eq(index).find(".degree").text(temp);
          $("#weather li").eq(index).find(".temp_min").text(min_temp);
          $("#weather li").eq(index).find(".temp_max").text(max_temp);
          $("#weather li").eq(index).find("h4").text(weather);
          $("#weather li").eq(index).find(".city").text(city);
          $("#weather li").eq(index).find(".nation").text(nation);
          $("#weather li").eq(index).find(".wind span").text(wind);
          $("#weather li").eq(index).find(".humidity span").text(humidity)
          $("#weather li").eq(index).find(".cloud span").text(cloud);
        }
      }); //ajax 
    }); //each문
  } //function w_info()


  $(document).on("click", ".cities button", function(){
    //console.log(this); //button
    const city_txt = $(this).text();
    console.log(city_txt);

    cityName.unshift(city_txt); // "cityName"이란 배열데이터에 "도시이름"을 첫번째 자리에 추가한다.
    console.log(cityName);

    $(this).remove; // 클릭한 버튼을 제거한다

    w_info();
  });


  // [검색 버튼]
  function searching(){
    const search_val = $("#search_box").val();
    //검색어에 전후 공백을 제거해보니 값이 없다면 (아무것도 안적은 상태)
    if(search_val.trim() == ""){
      alert("검색어를 입력 바랍니다.");
      $("#search_box").focus();
    }else{
      cityName.unshift(search_val);
      w_info();
    }
  }

  $(".search button").click(function(){
    searching();
  });

  $(".search").keydown(function(e){
    if(e.keyCode == "13"){
        searching();
    }
});


  navigator.geolocation.getCurrentPosition(function(position){
    const latitude = position.coords.latitude;
    const longtitude = position.coords.longitude;
    console.log(latitude);  //위도
    console.log(longtitude);  //경도(동경135도)


    $.ajax({
      url : `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=9857b03efd38c0fff9aaeb05ee8ee56b`,
      dataType : "json",
      success : function(data){
        //console.log(data);
  
        const city = data.name;
        //console.log("도시명 : " + city);

        const nation = data.sys.country;
        //console.log("국가명 : " + nation);


        cityName.unshift(city);
        w_info();
      }
    });
  });


});