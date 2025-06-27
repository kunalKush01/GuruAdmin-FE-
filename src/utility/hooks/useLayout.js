import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleLayout, handleLastLayout } from '@store/layout';

export const useLayout = () => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.layout);

  const setLayout = value => dispatch(handleLayout(value));
  const setLastLayout = value => dispatch(handleLastLayout(value));

  useEffect(() => {
    const breakpoint = 1200;

    // Initial check on mount
    if (window.innerWidth < breakpoint) {
      if (store.layout !== 'vertical') {
        setLastLayout(store.layout);
        setLayout('vertical');
      }
    }

    // Resize listener
    const handleResize = () => {
      if (
        window.innerWidth <= breakpoint &&
        store.layout !== 'vertical'
      ) {
        setLastLayout(store.layout);
        setLayout('vertical');
      } else if (
        window.innerWidth > breakpoint &&
        store.layout !== store.lastLayout
      ) {
        setLayout(store.lastLayout || 'horizontal');
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [store.layout, store.lastLayout]);

  return {
    layout: store.layout,
    setLayout,
    lastLayout: store.lastLayout,
    setLastLayout,
  };
};
