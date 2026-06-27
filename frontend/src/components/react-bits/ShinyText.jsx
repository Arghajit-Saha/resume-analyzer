
const ShinyText = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
}) => {
  return (
    <span
      className={`${className} ${disabled ? '' : 'animate-shine-solid'}`}
      style={{
        '--shiny-color': color,
        '--shiny-glow': shineColor,
        '--shiny-speed': `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
