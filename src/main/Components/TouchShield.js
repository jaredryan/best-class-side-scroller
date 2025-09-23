import React from "react";

const stripStyle = {
  position: "fixed",
  zIndex: 9999,
  background: "transparent",
  touchAction: "none",
};

const touchBlockers = {
    onTouchStart: (e) => e.preventDefault(),
    onTouchMove: (e) => e.preventDefault(),
    onTouchEnd: (e) => e.preventDefault(),
}

const TouchShield = ({ active = true, thickness = 15 }) => {
  if (!active) return null;

  return (
    <>
      {/* Left edge */}
      <div
        style={{
          ...stripStyle,
          left: 0,
          top: 0,
          bottom: 0,
          width: thickness,
        }}
        {...touchBlockers}
      />
      {/* Right edge */}
      <div
        style={{
          ...stripStyle,
          right: 0,
          top: 0,
          bottom: 0,
          width: thickness,
        }}
        {...touchBlockers}
      />
      {/* Top edge (blocks pull-to-refresh) */}
      <div
        style={{
          ...stripStyle,
          left: 0,
          right: 0,
          top: 0,
          height: thickness,
        }}
        {...touchBlockers}
      />
      {/* Bottom edge (blocks swipe-up for tab bar / home bar) */}
      <div
        style={{
          ...stripStyle,
          left: 0,
          right: 0,
          bottom: 0,
          height: thickness,
        }}
        {...touchBlockers}
      />
    </>
  );
};

export default TouchShield;
