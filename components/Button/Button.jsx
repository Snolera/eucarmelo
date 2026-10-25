import styles from "./Button.module.css";

// Botão outline do design; vira <a> quando recebe href
export default function Button({ href, variant = "light", size = "md", className = "", children, ...rest }) {
  const classes = [styles.button, styles[`button--${variant}`], styles[`button--${size}`], className]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
