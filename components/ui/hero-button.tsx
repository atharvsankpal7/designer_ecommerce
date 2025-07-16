import React, { FC } from 'react';
import styled from 'styled-components';

const HeroButton: FC = ({}) => {
  return (
    <StyledWrapper>
      <div className="button">
        <div className="left">
          <div className="metal-pill" />
          <div className="metal-reflex" />
          <div className="metal-line" />
        </div>
        <div className="right">
          <div className="glass-pill" />
          <div className="glass-reflex1" />
          <div className="glass-reflex2" />
          <div className="bulb-wire">
            <div className="top-wire" />
            <div className="top-curl" />
            <div className="mid-wire" />
            <div className="bottom-curl" />
            <div className="bottom-wire" />
            <div className="glow" />
          </div>
          <div className="caption">
            <ul className="sentence">
              <li className="letter">C</li>
              <li className="letter">u</li>
              <li className="letter">s</li>
              <li className="letter">t</li>
              <li className="letter">o</li>
              <li className="letter">m</li>
              <li className="letter" style={{ marginRight: 5 }}>
                
              </li>
              <li className="letter">D</li>
              <li className="letter">e</li>
              <li className="letter">s</li>
              <li className="letter">i</li>
              <li className="letter">g</li>
              <li className="letter">n</li>
              <li className="hidden-letter" style={{}} id="hl1">
                N
              </li>
              <li className="hidden-letter" id="hl2">
                o
              </li>
              <li className="hidden-letter" id="hl3">
                w
              </li>
              <li className="hidden-letter" id="hl4">
                !
              </li>
            </ul>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  .button {
    position: relative;
    width: 250px;
    height: 80px;
    border-radius: 50px;
    display: flex;
    transition: all 0.3s ease-in-out;
    box-shadow: 0px 0px 20px 0 rgba(147, 51, 234, 0.4);
  }

  .left {
    position: relative;
    width: 80px;
    height: 80px;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
    border: 1px solid rgba(147, 51, 234, 0.3);
    /* PREMIUM METAL STYLE */
    background: linear-gradient(135deg, 
      rgba(30, 27, 75, 1) 0%, 
      rgba(88, 28, 135, 1) 50%, 
      rgba(30, 27, 75, 1) 100%
    );
    box-shadow: inset 0 0 15px rgba(147, 51, 234, 0.2);
  }

  .metal-pill {
    position: absolute;
    width: 90px;
    height: 40px;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(196, 181, 253, 0.8) 30%,
      rgba(147, 51, 234, 0.6) 100%
    );
    top: 12%;
    left: 20%;
    filter: blur(7px);
    z-index: 2;
  }

  .metal-reflex {
    position: absolute;
    width: 70px;
    height: 50px;
    bottom: 5%;
    right: 0;
    border-bottom-left-radius: 30px;
    filter: blur(4px);
    border-bottom: 2px solid rgba(196, 181, 253, 0.8);
    background: transparent;
    z-index: 2;
  }

  .metal-line {
    position: absolute;
    top: 0;
    right: 1px;
    width: 3px;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(88, 28, 135, 1) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(88, 28, 135, 1) 100%
    );
    z-index: 0;
  }

  .right {
    overflow: hidden;
    position: relative;
    top: 0px;
    left: -2px;
    width: 170px;
    height: 80px;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background: linear-gradient(135deg, 
      rgba(147, 51, 234, 0.9) 0%, 
      rgba(219, 39, 119, 0.8) 50%, 
      rgba(147, 51, 234, 0.9) 100%
    );
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease-in-out;
  }

  .glass-pill {
    position: absolute;
    width: 140px;
    height: 50px;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.38) 25%,
      transparent 75%
    );
    top: 10%;
    left: 0%;
    filter: blur(1px);
  }

  .glass-reflex1 {
    position: absolute;
    width: 160px;
    height: 50px;
    bottom: 20%;
    left: 0;
    border-bottom-right-radius: 30px;
    filter: blur(4px);
    border-bottom: 2px solid rgba(196, 181, 253, 0.6);
    background: transparent;
    z-index: 2;
  }
  .glass-reflex2 {
    position: absolute;
    width: 160px;
    height: 50px;
    bottom: 0%;
    left: 0;
    border-bottom-right-radius: 30px;
    filter: blur(4px);
    border-bottom: 2px solid rgba(196, 181, 253, 0.4);
    background: transparent;
    z-index: 2;
  }

  .caption {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 35px;
    font-size: 15px;
    letter-spacing: 1.5px;
    color: white;
    text-shadow: 0 0px 12px rgba(250, 204, 21, 0.8);
    filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.6));
    font-weight: 600;
  }

  .bulb-wire {
    position: relative;
    width: 80px;
    height: 100%;
    filter: drop-shadow(0px 0px 8px rgba(250, 204, 21, 0.8));
  }

  .top-wire {
    position: absolute;
    width: 15px;
    height: 2px;
    top: 42%;
    background: rgba(250, 204, 21, 0.8);
    box-shadow: 0 0 4px rgba(250, 204, 21, 0.6);
    z-index: 2;
    transition: all 0.3s ease-in-out;
  }
  .top-curl {
    position: absolute;
    width: 8px;
    height: 10px;
    border-radius: 50%;
    border-bottom-left-radius: 0px;
    border: 2px solid rgba(250, 204, 21, 0.8);
    box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);
    top: 24px;
    left: 15px;
    z-index: 2;
    transition: all 0.3s ease-in-out;
  }
  .bottom-wire {
    position: absolute;
    width: 15px;
    height: 2px;
    bottom: 42%;
    background: rgba(250, 204, 21, 0.8);
    box-shadow: 0 0 4px rgba(250, 204, 21, 0.6);
    z-index: 2;
    transition: all 0.3s ease-in-out;
  }
  .bottom-curl {
    position: absolute;
    width: 8px;
    height: 10px;
    border-radius: 50%;
    border-top-left-radius: 0px;
    border: 2px solid rgba(250, 204, 21, 0.8);
    box-shadow: 0 0 4px rgba(250, 204, 21, 0.4);
    bottom: 25px;
    left: 15px;
    z-index: 2;
    transition: all 0.3s ease-in-out;
  }
  .mid-wire {
    position: absolute;
    width: 2px;
    height: 15px;
    background: rgba(250, 204, 21, 0.8);
    box-shadow: 0 0 4px rgba(250, 204, 21, 0.6);
    top: 40%;
    left: 15px;
    z-index: 2;
    transition: all 0.3s ease-in-out;
  }

  .glow {
    position: absolute;
    width: 35px;
    height: 35px;
    background: #f4a91f;
    background: rgb(244, 169, 31);
    background: radial-gradient(
      circle,
      rgba(244, 169, 31, 1) 0%,
      rgba(255, 255, 255, 1) 0%,
      rgba(244, 169, 31, 1) 100%
    );
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    filter: blur(15px);
    transition: all 0.2s ease-in-out;
  }

  .button:hover {
    cursor: pointer;
  }

  .button:hover .top-wire,
  .button:hover .bottom-wire {
    width: 55px;
  }

  .button:hover .mid-wire,
  .button:hover .top-curl,
  .button:hover .bottom-curl {
    left: 55px;
  }

  .button:hover .glow {
    left: 0px;
    width: 130px;
  }

  .button:hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 85px 0 #48301e;
  }

  .button:active,
  .button:focus {
    transform: scale(1);
  }

  .button {
    &:hover {
      .sentence .letter {
        transform: rotate(20deg) translateY(-20px);
        opacity: 0;
        filter: blur(20px);
      }
      .hidden-letter {
        top: 50%;
        transform: translateY(-50%);
        opacity: 1;
        filter: blur(0px);
      }
    }
  }
  .sentence {
    display: flex;
    padding: 0;
    .letter {
      list-style: none;
      font-weight: normal;
      filter: blur(0px);
      transition: all 0.5s ease-in-out;
    }
    .hidden-letter {
      position: absolute;
      list-style: none;
      font-weight: normal;
      opacity: 0;
      top: -20px;
      left: 15px;
      filter: blur(20px);
      transition: all 0.5s ease-in-out;
    }
    #hl1 {
      left: 40px;
    }
    #hl2 {
      left: 53px;
    }
    #hl3 {
      left: 63px;
    }
    #hl4 {
      left: 76px;
    }
  }`;

export default HeroButton;
