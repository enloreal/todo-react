import styled from "styled-components";

export const lightTheme = {
  backgroundColor: "aliceblue",
  textColor: "#000000",
  buttonBackground: "azure",
  buttonTextColor: "#000000",
  inputBackground: "white",
  themeGlowColor: "blue",
};

export const darkTheme = {
  backgroundColor: "#333333",
  textColor: "#ffffff",
  buttonBackground: "#555555",
  buttonTextColor: "#ffffff",
  inputBackground: "azure",
  themeGlowColor: "orange",
};

export const MainContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  font-family: system-ui;
  max-width: 1000px;
  min-height: 96vh;
  margin: auto;
  padding: 20px;
  margin-top: -10px;
  display: flex;
  flex-direction: column;
  align-items: end;
  position: relative;
  transition: background-color 0.3s, color 0.3s;
`;

export const StyledButton = styled.button`
  background-color: ${(props) => props.theme.buttonBackground};
  color: ${(props) => props.theme.buttonTextColor};
  font-family: system-ui;
  margin-top: 5px;
  margin-left: 15px;
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 10px;
  border-color: cadetblue;
  cursor: pointer;
  box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    opacity: 0.7;
    background-color: ${(props) => props.theme.backgroundColor};
    transition: opacity 0.3s, background-color 0.3s;
  }
`;

export const TaskCheckBox = styled.input`
  position: absolute;
  left: 20px;
  width: 1.5em;
  height: 1.5rem;
  accent-color: green;
  cursor: pointer;

  &:hover {
    accent-color: red;
    width: 1.8em;
    height: 1.8rem;
    left: 18px;
  }
`;

export const StyledInput = styled.input`
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.inputBackground};
  border-color: cadetblue;
  width: 300px;
  box-shadow: 0px 4px 9px 0px rgba(0, 0, 0, 0.2);
`;

export const FunctionalTitle = styled.h4`
  color: grey;
  font-style: italic;
  font-size: 15px;
`;

export const ControlButton = styled(StyledButton)`
  width: 100%;
  border-radius: 20px;
  margin-left: 0px;
`;

export const StyledInputContainer = styled.div`
  align-self: center;
`;

export const StyledButtonThemes = styled(StyledButton)`
  align-self: start;
  position: absolute;

  &:hover {
    box-shadow: 0px 0px 35px -1px ${(props) => props.theme.themeGlowColor};
    transition: box-shadow 1s, background-color 1s;
  }

  &:not(:hover) {
    box-shadow: none;
    transition: box-shadow 1s, background-color 1s;
  }
`;

export const StyledButtonSave = styled(StyledButton)`
  &:hover {
    background-color: green;
  }
`;

export const StyledButtonCancel = styled(StyledButton)`
  &:hover {
    background-color: red;
  }
`;
export const ErrorMessage = styled.div`
  position: absolute;
  width: 330px;
  height: 40px;
  background: #72A0C1;
  left: 0;
  right: 0;
  margin: auto;
  animation: fadeInOut 6s ease forwards;
  text-align: center;
  padding-top: 20px;
  border-radius: 25px;
  border: 3px solid #002D62;
  font-size: 18px;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    15% {
      opacity: 0;
    }
    50% { /* элемент будет полностью видим на 40% времени анимации */
      opacity: 0.8;
    }
    60% { /* элемент будет полностью видим на 40% времени анимации */
    opacity: 0.8;
    }
    100% {
      opacity: 0;
    }
`;
