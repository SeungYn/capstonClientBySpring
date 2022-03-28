import React, { useRef } from 'react';

const FirstPage = (props) => {
  const mapRef = useRef();
  useEffect(() => {
    if (!location) {
      console.log(location);
      return;
    }
    console.log(location, 1);
    // Cancel location watch after 3sec
    // setTimeout(() => {
    //   cancelLocationWatch();
    //   setIsWatchForLocation(false);
    // }, 3000);

    const mapContainer = mapRef.current;
    const mapOption = {
      center: new kakao.maps.LatLng(location.latitude, location.longitude),
      level: 3,
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const markerPosition = new kakao.maps.LatLng(
      location.latitude,
      location.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, [location, cancelLocationWatch]);
  return (
    <section>
      <div
        ref={mapRef}
        className='kakao-map'
        style={{ width: '300px', height: '300px' }}
      ></div>
    </section>
  );
};

export default FirstPage;
