import { useEffect } from 'react';
import './App.css';

function App({ kakao }) {
  let latitude = '';
  let longitude = '';
  const success = (position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log(latitude, longitude);
  };

  const error = () => {
    console.log('시래패패패패');
  };

  if (!navigator.geolocation) {
    console.log('사용불가능');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  useEffect(() => {
    const container = document.querySelector('.kakao-map');
    const options = {
      center: new kakao.maps.LatLng(lat, lon),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
    var geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(meeting_place, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
          content:
            '<div style="width:150px;text-align:center;padding:6px 0;">' +
            meeting_place +
            '</div>',
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
      }
    });
    //위도, 경도로 변환 및 마커표시
    // let markerPosition  = new kakao.maps.LatLng(lat, lon);
    // let marker = new kakao.maps.Marker({
    //     position: markerPosition
    // });
    // marker.setMap(map);
  }, []);

  console.log(111);
  return (
    <div className='App'>
      <div className='kakao-map'></div>
    </div>
  );
}

export default App;
