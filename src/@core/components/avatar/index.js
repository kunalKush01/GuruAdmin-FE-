// ** React Imports
import { forwardRef } from "react";

// ** Third Party Components
import PropTypes from "prop-types";
import classnames from "classnames";

// ** Reactstrap Imports
import { Badge } from "reactstrap";

// ✅ Fallback if tag is undefined
const Avatar = forwardRef((props, ref) => {
  const {
    img,
    size,
    icon,
    color,
    status,
    badgeUp,
    content,
    tag,
    initials,
    imgWidth,
    className,
    badgeText,
    imgHeight,
    badgeColor,
    imgClassName,
    contentStyles,
    editProfileIcon,
    ...rest
  } = props;

  // Ensure tag is either a valid string or component, default to 'div'
  const Tag = typeof tag === "string" || typeof tag === "function" ? tag : "div";

  const getInitials = (str) => {
    const results = [];
    const wordArray = str?.split(" ") || [];
    wordArray.forEach((e) => {
      results.push(e[0]);
    });
    return results.join("");
  };

  return (
    <Tag
      className={classnames("avatar", {
        [className]: className,
        [`bg-${color}`]: color,
        [`avatar-${size}`]: size,
      })}
      ref={ref}
      {...rest}
    >
      {img === false || img === undefined ? (
        <span
          className={classnames("avatar-content", {
            "position-relative": badgeUp,
          })}
          style={contentStyles}
        >
          {initials ? getInitials(content) : content}
          {icon ? icon : null}
          {badgeUp ? (
            <Badge color={badgeColor || "primary"} className="badge-sm badge-up" pill>
              {badgeText || "0"}
            </Badge>
          ) : null}
        </span>
      ) : (
        <img
          className={classnames({ [imgClassName]: imgClassName })}
          src={img}
          alt="avatarImg"
          height={imgHeight && !size ? imgHeight : 32}
          width={imgWidth && !size ? imgWidth : 32}
        />
      )}
      {status ? (
        <img
          src={editProfileIcon}
          className="editProfileIcon position-absolute"
          style={{ width: "min-content" }}
        />
      ) : null}
    </Tag>
  );
});

export default Avatar;

// ** PropTypes
Avatar.propTypes = {
  icon: PropTypes.node,
  src: PropTypes.string,
  badgeUp: PropTypes.bool,
  content: PropTypes.string,
  badgeText: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  contentStyles: PropTypes.object,
  size: PropTypes.oneOf(["sm", "lg", "xl"]),
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  status: PropTypes.oneOf(["online", "offline", "away", "busy"]),
  imgHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imgWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badgeColor: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "info",
    "warning",
    "dark",
    "light-primary",
    "light-secondary",
    "light-success",
    "light-danger",
    "light-info",
    "light-warning",
    "light-dark",
  ]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "info",
    "warning",
    "dark",
    "light-primary",
    "light-secondary",
    "light-success",
    "light-danger",
    "light-info",
    "light-warning",
    "light-dark",
  ]),
  initials: (props) => {
    if (props["initials"] && props["content"] === undefined) {
      return new Error("content prop is required with initials prop.");
    }
    if (props["initials"] && typeof props["content"] !== "string") {
      return new Error("content prop must be a string.");
    }
    if (typeof props["initials"] !== "boolean" && props["initials"] !== undefined) {
      return new Error("initials must be a boolean!");
    }
  },
};

// ** Default Props
Avatar.defaultProps = {
  tag: "div",
};
