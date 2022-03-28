import React from 'react';

const FirstPage = (props) => {
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
