const HeaderPart = () => {
  return (
    <div className="w-screen flex-col">
      <div className="flex gap-3 items-center justify-center">
        <div
          className="w-32 h-15 bg-cover bg-no-repeat mt-1 ml-2"
          style={{ backgroundImage: "url('NexaLogo.svg')" }}
        ></div>
      </div>
      <hr className="border-t border-gray-300 mt-3"></hr>
    </div>
  );
};

export default HeaderPart;
