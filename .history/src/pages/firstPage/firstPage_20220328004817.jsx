import React, { useRef } from 'react';

const FirstPage = (props) => {
  const mapRef = useRef();
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
