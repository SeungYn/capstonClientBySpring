import React, { useState } from 'react';
import styles from './partyMakerPage.module.css';

const PartyMakerPage = ({
  activate,
  onActivate,
  onMakeParty,
  clickedRestaurant,
  restaurantsInfo,
}) => {
  const [personCount, setPersonCount] = useState(4);
  const [inputTitle, setInputTitle] = useState('');
  const onXBtn = () => {
    onActivate(activate);
  };

  const selectOnChange = (e) => {
    console.log(e.target.value);
    setPersonCount(e.target.value);
  };
  const inputOnChange = (e) => {
    setInputTitle(e.target.value);
  };

  const onChange = (event) => {
    const {
      target: { name, value, checked },
    } = event;

    switch (name) {
      case 'personNum':
        return setPersonCount(value);

      default:
    }
  };

  return (
    <section
      className={`${styles.partyMakerContainer} ${
        activate ? styles.partyMakerContainerOn : styles.partyMakerContainerOff
      }`}
    >
      <header className={styles.partyMakerHeader}>
        <div className={styles.partyMakerHeader__left}>
          <span className={styles.left__span} onClick={onXBtn}>
            X
          </span>
          <span className={styles.left__span}>파티만들기</span>
        </div>
      </header>
      <div className={styles.partyMakerBody}>
        <input
          type='text'
          className={styles.partyMakerBody__title}
          placeholder='제목'
          name='title'
        ></input>

        <p className={styles.partyMakerBody__nowRestaurant}>
          {clickedRestaurant}
        </p>

        <div className={styles.partyMakerBody__num}>
          최대 인원수 &nbsp;
          <select
            onChange={onChange}
            className={styles.partyMakerBody__num__select}
            value={personCount}
            name='personNum'
          >
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
          </select>
          &nbsp; 명
        </div>

        <button className={styles.makerBtn}>만들기</button>
      </div>
    </section>
  );
};

export default PartyMakerPage;
