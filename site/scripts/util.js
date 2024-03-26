const formatDate = () => {
  // Get the current date
  const currentDate = new Date();

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    currentDate.getDay()
  ];

  // Construct the formatted string
  return `${dayOfWeek} ${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
};

function offset(element) {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}

const calculateTransformOrigins = (selector) => {
  const elements = document.querySelectorAll(selector);
  const tOrigin = new Array(elements.length);

  elements.forEach((element, idx) => {
    // store the transform origin
    const elemRect = element.getBoundingClientRect();
    const elemOffset = offset(element);

    const elemCenter = {
      x: elemOffset.left + elemRect.width / 2.0,
      y: elemOffset.top + elemRect.height / 2.0,
    };

    tOrigin[idx] = elemCenter;
  });

  return tOrigin;
};

export { calculateTransformOrigins, formatDate };
