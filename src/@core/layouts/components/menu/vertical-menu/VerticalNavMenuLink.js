// ** React Imports
import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'
import { Trans } from 'react-i18next'

const VerticalNavMenuLink = ({
  item,
  activeItem,
  setActiveItem,
  currentActiveItem,
}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** Hooks
  const location = useLocation()

  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)
    }
  }, [location])

  return (
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.url === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        // target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.url === true
          ? {
              href: item.url 
            }
          : {
              to: item.url || '/',
              isActive: match => {
                if (!match) {
                  return false
                }

                if (
                  match.url &&
                  match.url !== '' &&
                  match.url === item.url
                ) {
                  currentActiveItem = item.url
                }
              }
            })}
      >
        <span className='menu-item text-truncate d-flex align-items-center'>
          <img src={item.icon} height={20} width={20} style={{ marginLeft: '0px', marginRight: '10px'}} />
          <Trans i18nKey={item?.name}/>
        </span>
        {item.badge && item.badgeText ? (
          <Badge className='ms-auto me-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
