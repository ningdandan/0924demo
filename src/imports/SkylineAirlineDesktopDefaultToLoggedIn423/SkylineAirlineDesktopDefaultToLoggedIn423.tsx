import svgPaths from "./svg-bbwd7ob71f";
import imgImageUser from "./0856350b78193e2451d86d23ddd49679701dbd7a.png";
import { imgVector } from "./svg-qa0v5";

function Text() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Bakbak_One:Regular',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#321863] text-[20px] text-center whitespace-nowrap">Skyline Airways</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[28px] relative shrink-0 w-[67.164px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[-40px] relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[24px] relative shrink-0 w-[48.164px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Flights</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[46.711px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Hotels</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#364153] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Destinations</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative size-full">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-gradient-to-r flex-[1_0_0] from-[#9810fa] h-[36px] min-w-px relative rounded-[16777200px] to-[#155dfc]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[24px] py-[8px] relative size-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[-0.1504px] whitespace-nowrap">Log Out</p>
        </div>
      </div>
    </div>
  );
}

function ImageUser() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Image (User)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageUser} />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(255,255,255,0)] relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip p-[2px] relative rounded-[inherit] size-full">
        <ImageUser />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[16777200px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[40px] relative shrink-0 w-[152.18px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button1 />
        <Container4 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[40px] relative shrink-0 w-[417.227px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-center relative size-full">
        <Navigation />
        <Container3 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Button />
      <Container2 />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] content-stretch flex flex-col h-[65px] items-start left-0 pb-px pt-[12px] px-[28.5px] top-0 w-[1337px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[rgba(229,231,235,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[21px] left-0 not-italic text-[14px] text-white top-0 tracking-[-0.1504px] whitespace-nowrap">Can I bring my pet on my trip to Paris?</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#1d293d] h-[53px] relative rounded-bl-[24px] rounded-br-[24px] rounded-tl-[24px] rounded-tr-[10px] shrink-0 w-[293.734px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[16px] px-[24px] relative size-full">
        <Paragraph />
      </div>
    </div>
  );
}

function ImageUser1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Image (User)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageUser} />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <ImageUser1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[12px] h-[53px] items-start justify-end relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[10px] size-[20px] top-[10px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_19_333)" id="Icon">
          <path d={svgPaths.p24941500} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 2.5V5.83333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 4.16667H15" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M3.33333 14.1667V15.8333" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M4.16667 15H2.5" id="Vector_5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_19_333">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[30px] rounded-[16777200px] size-[12px] top-[30px]" data-name="Container" />;
}

function Container9() {
  return (
    <div className="absolute left-0 rounded-[16777200px] size-[40px] top-0" style={{ backgroundImage: "linear-gradient(135deg, rgb(173, 70, 255) 0%, rgb(43, 127, 255) 100%)" }} data-name="Container">
      <Icon />
      <Container10 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[8px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p155e8580} id="Vector" stroke="var(--stroke-0, #8200DB)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bg-[#faf5ff] h-[20px] left-[117.5px] rounded-[8px] top-[91px] w-[127.195px]" data-name="Link">
      <Icon1 />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[24px] not-italic text-[#8200db] text-[12px] top-[3px] whitespace-nowrap">Pet Travel Policy</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[22.5px] left-[248.68px] top-[90px] w-[15px]" data-name="Text">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-0 not-italic text-[#1e2939] text-[15px] top-[-0.5px] tracking-[-0.2344px] whitespace-nowrap">👋</p>
    </div>
  );
}

function HighlightedMessage() {
  return (
    <div className="absolute h-[135px] left-[52px] top-0 w-[672px]" data-name="HighlightedMessage">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-0 not-italic text-[#1e2939] text-[15px] top-[-0.5px] tracking-[-0.2344px] w-[672px] whitespace-pre-wrap">{`Hi, Annie. Happy to help! Here's what I found about bringing pets on international flights:  You can bring your pet on an international flight as long as it meets our weight and vaccination criteria. For in-cabin and cargo travel, your pet and crate must meet certain requirements. We will also need a valid health certificate issued within 10 days of departure and country-specific requirements for your destination. `}</p>
      <Link3 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.5px] left-[362.95px] not-italic text-[#1e2939] text-[15px] top-[112px] tracking-[-0.2344px] whitespace-nowrap">{` `}</p>
      <Text1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[135.5px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <HighlightedMessage />
    </div>
  );
}

function ChatView() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[364.5px] items-start left-[220.5px] top-[129px] w-[896px]" data-name="ChatView">
      <Container5 />
      <Container8 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1337_0_0] h-[919px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Header />
        <ChatView />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="absolute content-stretch flex h-[919px] items-start left-0 pl-[50px] top-0 w-[1387px]" style={{ backgroundImage: "linear-gradient(146.472deg, rgb(250, 245, 255) 0%, rgb(239, 246, 255) 50%, rgba(250, 245, 255, 0.5) 100%)" }} data-name="App">
      <Container />
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[1.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[41.67%_10.71%_58.33%_5.95%]" data-name="Vector">
        <div className="absolute inset-[-0.74px_-6.66%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.5866 1.47985">
            <path d="M0.739925 0.739925H11.8467" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.47985" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col h-[2px] items-start pt-[0.172px] px-[-0.164px] relative shrink-0 w-full" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-0 items-start left-[4px] pt-[-0.995px] px-[-0.5px] top-[9.99px] w-[12px]" data-name="Container">
      <Container14 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[13.328px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[5.95%_58.33%_10.71%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-6.66%_-0.74px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.47985 12.5866">
            <path d="M0.739925 0.739925V11.8467" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.47985" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[13px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[-0.164px] px-[0.172px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col h-[12px] items-start left-[9.99px] pl-[-0.995px] pr-[-1.005px] pt-[-0.5px] top-[4px] w-0" data-name="Container">
      <Container16 />
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="PlusIcon">
      <Container13 />
      <Container15 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <PlusIcon />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] py-[2px] relative size-full">
        <Container12 />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[524_0_0] h-[24px] min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#99a1af] text-[16px] tracking-[-0.3125px] whitespace-nowrap">Ask me anything</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[3.8%_7.28%_5.3%_5.22%]" data-name="Group">
      <div className="absolute inset-[81.07%_51.03%_5.3%_48.97%]" data-name="Vector">
        <div className="absolute inset-[-27.76%_-0.82px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.64012 4.59432">
            <path d="M0.820061 0.820061V3.77426" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64012" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[40.16%_7.28%_18.93%_5.22%]" data-name="Vector">
        <div className="absolute inset-[-9.25%_-5.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.353 10.5027">
            <path d={svgPaths.p2f35bdc0} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64012" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[3.8%_32.28%_37.11%_30.22%]" data-name="Vector">
        <div className="absolute inset-[-6.41%_-13.95%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.51707 14.4417">
            <path d={svgPaths.p812a200} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.64012" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[21.664px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[0.168px] px-[0.164px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[-0.996px] px-[-1px] relative shrink-0 w-full" data-name="Container">
      <Container20 />
    </div>
  );
}

function MicrophoneIcon() {
  return (
    <div className="h-[22px] relative shrink-0 w-full" data-name="MicrophoneIcon">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pt-px px-[1.5px] relative size-full">
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[3px] relative size-full">
        <MicrophoneIcon />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 px-[10px] rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container18 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[6.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[11.9%_58.33%_16.67%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-15.59%_-0.74px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.48247 6.23693">
            <path d="M0.741233 0.741233V5.49569" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.48247" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[7px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[0.172px] px-[0.168px] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5px] items-start left-[3.33px] pl-[-0.995px] pr-[-1.005px] pt-[-1px] top-[7.5px] w-0" data-name="Container">
      <Container23 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[11.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[6.94%_58.33%_9.72%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-7.71%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.49833 11.2118">
            <path d="M0.749164 0.749164V10.4626" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49833" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[0.172px] px-[0.168px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex flex-col h-[10px] items-start left-[6.66px] pl-[-0.995px] pr-[-1.005px] pt-[-1px] top-[5px] w-0" data-name="Container">
      <Container25 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[16.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[4.9%_58.33%_6.86%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-5.11%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.50128 16.1979">
            <path d="M0.750639 0.750639V15.4473" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.50128" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[17px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[0.172px] px-[0.172px] relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col h-[15px] items-start left-[9.99px] pl-[-0.995px] pr-[-1.005px] pt-[-1px] top-[2.5px] w-0" data-name="Container">
      <Container27 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[11.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[6.94%_58.33%_9.72%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-7.71%_-0.75px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.49833 11.2118">
            <path d="M0.749164 0.749164V10.4626" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.49833" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[12px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[0.172px] px-[0.168px] relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col h-[10px] items-start left-[13.33px] pl-[-0.995px] pr-[-1.005px] pt-[-1px] top-[5px] w-0" data-name="Container">
      <Container29 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[6.656px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[11.9%_58.33%_16.67%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-15.59%_-0.74px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.48247 6.23693">
            <path d="M0.741233 0.741233V5.49569" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.48247" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[7px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start pt-[0.172px] px-[0.168px] relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex flex-col h-[5px] items-start left-[16.66px] pl-[-0.995px] pr-[-1.005px] pt-[-1px] top-[7.5px] w-0" data-name="Container">
      <Container31 />
    </div>
  );
}

function WaveformIcon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="WaveformIcon">
      <Container22 />
      <Container24 />
      <Container26 />
      <Container28 />
      <Container30 />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <WaveformIcon />
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[52px] px-[10px] rounded-[16777200px] size-[40px] top-0" data-name="Button">
      <Container21 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[40px] relative shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function GradientInputBar1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-[680px]" data-name="GradientInputBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button2 />
        <TextInput />
        <Container17 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[68px] relative rounded-[89px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] shrink-0 w-full" data-name="Card">
      <div className="content-stretch flex flex-col items-start px-[20px] py-[14px] relative size-full">
        <GradientInputBar1 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[108px] items-start left-0 pl-[20px] pr-[92px] pt-[20px] rounded-[100px] top-0 w-[832px]" style={{ backgroundImage: "linear-gradient(172.604deg, rgb(242, 213, 255) 0%, rgb(213, 229, 255) 50%, rgb(242, 213, 255) 100%)" }} data-name="Container">
      <Card />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[4.55%_4.76%]" data-name="Group">
      <div className="absolute inset-[4.55%_4.76%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1px_-1px] mask-size-[21px_22px]" style={{ maskImage: `url('${imgVector}')` }} data-name="Vector">
        <div className="absolute inset-[-5%_-5.26%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 22">
            <path d={svgPaths.pefd4400} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function PhoneWithChatIcon() {
  return (
    <div className="content-stretch flex flex-col h-[22px] items-start relative shrink-0 w-full" data-name="PhoneWithChatIcon">
      <Icon10 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[22px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <PhoneWithChatIcon />
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[754px] px-[18.5px] rounded-[16777200px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.06)] size-[58px] top-[25px]" data-name="Button">
      <Container32 />
    </div>
  );
}

function GradientInputBar() {
  return (
    <div className="h-[108px] relative shrink-0 w-full" data-name="GradientInputBar">
      <Container11 />
      <Button5 />
    </div>
  );
}

function App1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[168px] items-start left-[245.5px] pt-[30px] px-[32px] top-[719px] w-[896px]" data-name="App">
      <GradientInputBar />
    </div>
  );
}

export default function SkylineAirlineDesktopDefaultToLoggedIn() {
  return (
    <div className="bg-white relative size-full" data-name="Skyline airline - Desktop - Default to Logged in - 423">
      <App />
      <App1 />
    </div>
  );
}