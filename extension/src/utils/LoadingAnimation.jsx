const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[70px] text-center">
        <div
          className="inline-block w-[18px] h-[18px] bg-gray-800 rounded-full animate-sk-bouncedelay"
          style={{ animationDelay: "-0.32s" }}
        ></div>
        <div
          className="inline-block w-[18px] h-[18px] bg-gray-800 rounded-full mx-[5px] animate-sk-bouncedelay"
          style={{ animationDelay: "-0.16s" }}
        ></div>
        <div className="inline-block w-[18px] h-[18px] bg-gray-800 rounded-full animate-sk-bouncedelay"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
