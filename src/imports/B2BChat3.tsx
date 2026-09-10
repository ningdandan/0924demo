import svgPaths from "./svg-ge5cchvlaj";
import imgChatGptImageNov132025085309Pm1 from "figma:asset/a0ba9fbc686d098ae90ddc68fbe9918773ed0787.png";
import imgEllipse1 from "figma:asset/29430ecde91fa3edf6e8c948dcd5e35351d6faf7.png";
import imgAgentforceAvatar from "figma:asset/05d69c546dbc8713295095e9261747e109b773f4.png";

function Logo() {
  return (
    <div className="bg-white flex-[1_0_0] h-[46px] min-h-px min-w-px overflow-clip relative" data-name="LOGO">
      <div className="absolute left-0 size-[86px] top-[-19px]" data-name="ChatGPT Image Nov 13, 2025, 08_53_09 PM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImageNov132025085309Pm1} />
      </div>
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="bg-[#066afe] content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[16px] py-px relative rounded-[9999px] shrink-0" data-name="Button container">
      <p className="css-ew64yg font-['Roboto:SemiBold',sans-serif] font-semibold leading-[19px] relative shrink-0 text-[14px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Log In
      </p>
    </div>
  );
}

function BrandButton() {
  return (
    <div className="content-stretch flex h-[32px] items-end justify-center relative shrink-0" data-name="Brand button">
      <ButtonContainer />
    </div>
  );
}

function SiteIa() {
  return (
    <div className="bg-white content-stretch flex gap-[24px] items-center overflow-clip px-[12px] py-0 relative shrink-0" data-name="SITE IA">
      <div className="relative shrink-0 size-[34px]">
        <img alt="" className="block max-w-none size-full" height="34" src={imgEllipse1} width="34" />
      </div>
      <BrandButton />
    </div>
  );
}

function HighLevelSiteNavAuth() {
  return (
    <div className="absolute bg-white content-stretch flex items-end left-0 p-[8px] top-0 w-[1345px]" data-name="HIGH LEVEL SITE NAV AUTH">
      <div aria-hidden="true" className="absolute border-[#c9c9c9] border-b border-solid inset-0 pointer-events-none" />
      <Logo />
      <SiteIa />
    </div>
  );
}

function AiAgents() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ai-agents">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ai-agents">
          <path d={svgPaths.p118af100} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ProjectHeader() {
  return (
    <div className="content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[12px] shrink-0" data-name="Project Header">
      <AiAgents />
    </div>
  );
}

function Frame2() {
  return <div className="bg-white h-[24px] shrink-0 w-[20px]" />;
}

function Folder() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="folder">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="folder">
          <path d={svgPaths.p23474400} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ProjectHeader1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[12px] shrink-0" data-name="Project Header">
      <Folder />
    </div>
  );
}

function Frame1() {
  return <div className="bg-white h-[24px] shrink-0 w-[20px]" />;
}

function DirectMessages() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="direct-messages">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="direct-messages">
          <path d={svgPaths.p1e894f80} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ProjectHeader2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[12px] shrink-0" data-name="Project Header">
      <DirectMessages />
    </div>
  );
}

function Frame() {
  return <div className="bg-white flex-[1_0_0] min-h-px min-w-px w-[18px]" />;
}

function Settings() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="settings">
          <path d={svgPaths.p3ceb00b0} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function ProjectHeader3() {
  return (
    <div className="content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[12px] shrink-0" data-name="Project Header">
      <Settings />
    </div>
  );
}

function OldB2BNavBarOpenA() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[771px] items-start left-0 max-w-[250px] px-[12px] py-[16px] top-[62px]" data-name="OLD B2B NAV BAR OPEN A">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-r border-solid inset-0 pointer-events-none" />
      <ProjectHeader />
      <Frame2 />
      <ProjectHeader1 />
      <Frame1 />
      <ProjectHeader2 />
      <Frame />
      <ProjectHeader3 />
    </div>
  );
}

function Chat() {
  return (
    <div className="bg-[#f3f3f3] content-stretch flex items-start justify-end max-w-[420px] p-[8px] relative rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[12px] shrink-0" data-name="Chat">
      <p className="css-4hzbpn flex-[1_0_0] font-['Roboto:Regular',sans-serif] font-normal leading-[18px] min-h-px min-w-px relative text-[#1d1c1d] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Pet policy
      </p>
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-end min-h-px min-w-px relative" data-name="Content">
      <Chat />
    </div>
  );
}

function AgentforceAvatar() {
  return (
    <div className="content-stretch flex items-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Agentforce Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgAgentforceAvatar} />
    </div>
  );
}

function ChatInput() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 w-full" data-name="Chat Input">
      <Content />
      <AgentforceAvatar />
    </div>
  );
}

function AgentforceAvatar1() {
  return (
    <div className="content-stretch flex items-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Agentforce Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[9999px] size-full" src={imgChatGptImageNov132025085309Pm1} />
    </div>
  );
}

function Chat1() {
  return (
    <div className="bg-white relative rounded-bl-[12px] rounded-tl-[12px] rounded-tr-[12px] shrink-0 w-full" data-name="Chat">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex items-start justify-end p-[8px] relative w-full">
          <div className="flex-[1_0_0] font-['Helvetica:Regular',sans-serif] leading-[0] min-h-px min-w-px not-italic relative text-[15px] text-black">
            <p className="css-4hzbpn leading-[normal] mb-0">Great question. I have curated some content and crated a plan for you start setting up the Packaging Labeling Machine 3XYH70. The citations include links to help documentation, video walkthroughs, time estimates, and requirements. The plan is in 7 steps and includes:</p>
            <p className="css-4hzbpn leading-[normal] mb-0">&nbsp;</p>
            <ul className="list-disc mb-0">
              <li className="css-4hzbpn mb-0 ms-[22.5px]">
                <span className="leading-[normal]">{`Pre-Installation & Planning`}</span>
              </li>
              <li className="css-4hzbpn mb-0 ms-[22.5px]">
                <span className="leading-[normal]">Physical Installation</span>
              </li>
              <li className="css-4hzbpn mb-0 ms-[22.5px]">
                <span className="leading-[normal]">Network Configuration</span>
              </li>
              <li className="css-4hzbpn mb-0 ms-[22.5px]">
                <span className="leading-[normal]">{`Software & Data Configuration`}</span>
              </li>
              <li className="css-4hzbpn mb-0 ms-[22.5px]">
                <span className="leading-[normal]">{`Testing & Commissioning`}</span>
              </li>
              <li className="css-4hzbpn mb-0 ms-[22.5px]">
                <span className="leading-[normal]">{`Training & Handover`}</span>
              </li>
              <li className="css-4hzbpn ms-[22.5px]">
                <span className="leading-[normal]">{`Go-Live & Support`}</span>
              </li>
            </ul>
            <p className="css-4hzbpn leading-[normal] mb-0">&nbsp;</p>
            <p className="css-4hzbpn leading-[normal]">When you are ready I can start walking you through the plan steps one-by-one.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p26bce780} fill="var(--fill-0, white)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonContainer1() {
  return (
    <div className="bg-[#066afe] content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[16px] py-px relative rounded-[9999px] shrink-0" data-name="Button container">
      <Icon />
      <p className="css-ew64yg font-['Roboto:SemiBold',sans-serif] font-semibold leading-[19px] relative shrink-0 text-[14px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        Start Plan
      </p>
    </div>
  );
}

function BrandButton1() {
  return (
    <div className="content-stretch flex h-[32px] items-end justify-center relative shrink-0" data-name="Brand button">
      <ButtonContainer1 />
    </div>
  );
}

function RightActions() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Right actions">
      <BrandButton1 />
    </div>
  );
}

function Copy() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="copy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="copy">
          <path d={svgPaths.p33efa500} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function SiteIa1() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="SITE IA">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip px-[8px] py-0 relative rounded-[inherit]">
        <Copy />
      </div>
    </div>
  );
}

function ThumbsUp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="thumbs-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="thumbs-up">
          <path d={svgPaths.p37e59b80} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function SiteIa2() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="SITE IA">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip px-[8px] py-0 relative rounded-[inherit]">
        <ThumbsUp />
      </div>
    </div>
  );
}

function ThumbsDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="thumbs-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="thumbs-down">
          <path d={svgPaths.p1d23780} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function SiteIa3() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="SITE IA">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip px-[8px] py-0 relative rounded-[inherit]">
        <ThumbsDown />
      </div>
    </div>
  );
}

function Branch() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="branch">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="branch">
          <path d={svgPaths.p168f6f00} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function SiteIa4() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="SITE IA">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip px-[8px] py-0 relative rounded-[inherit]">
        <Branch />
      </div>
    </div>
  );
}

function EllipsisHorizontal() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="ellipsis-horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ellipsis-horizontal">
          <path d={svgPaths.p273aff0} fill="var(--fill-0, #77757A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function SiteIa5() {
  return (
    <div className="bg-white h-full relative shrink-0" data-name="SITE IA">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex h-full items-center overflow-clip px-[8px] py-0 relative rounded-[inherit]">
        <EllipsisHorizontal />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[42px] items-center justify-end relative shrink-0 w-full" data-name="Container">
      <SiteIa1 />
      <SiteIa2 />
      <SiteIa3 />
      <SiteIa4 />
      <SiteIa5 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white content-stretch flex flex-col items-end overflow-clip relative shrink-0 w-full">
      <Container />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative" data-name="Content">
      <Chat1 />
      <RightActions />
      <Frame4 />
    </div>
  );
}

function ChatInput1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0 w-full" data-name="Chat Input">
      <AgentforceAvatar1 />
      <Content1 />
    </div>
  );
}

function Convo1() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Convo">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <ChatInput />
          <ChatInput1 />
        </div>
      </div>
    </div>
  );
}

function Convo() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-clip relative w-full" data-name="Convo">
      <Convo1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M4.16667 10H15.8333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 4.16667V15.8333" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function BtnUpload() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[40px]" data-name="BTN UPLOAD">
      <div aria-hidden="true" className="absolute border-2 border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[16777200px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[2px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Text Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="css-ew64yg font-['Roboto:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#99a1af] text-[16px] tracking-[-0.3125px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Search for Company Resources
        </p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M10 15.8333V18.3333" id="Vector" stroke="var(--stroke-0, #6E6E6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pb4beb80} id="Vector_2" stroke="var(--stroke-0, #6E6E6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25182900} id="Vector_3" stroke="var(--stroke-0, #6E6E6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <g filter="url(#filter0_d_2_2368)" id="Vector_4">
            <path d="M4 4L17 16" shapeRendering="crispEdges" stroke="var(--stroke-0, #6E6E6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </g>
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="15.6667" id="filter0_d_2_2368" width="14.6667" x="3.16666" y="3.16666">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_2368" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_2368" mode="normal" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function VoiceInput() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[16777200px] shrink-0 size-[40px]" data-name="VOICE INPUT">
      <Icon2 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[4.55%_6.11%_4.55%_5%]">
      <div className="absolute inset-[-5%_-5.63%_-5%_-5.62%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.7778 22">
          <g id="Group 11">
            <path d="M1 7.66667V14.3333" id="Vector" stroke="var(--stroke-0, #6E6F6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M5.44444 4.33333V17.6667" id="Vector_2" stroke="var(--stroke-0, #6E6F6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M9.88889 1V21" id="Vector_3" stroke="var(--stroke-0, #6E6F6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M14.3333 4.33333V17.6667" id="Vector_4" stroke="var(--stroke-0, #6E6F6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M18.7778 7.66667V14.3333" id="Vector_5" stroke="var(--stroke-0, #6E6F6E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function WaveformIcon() {
  return (
    <div className="h-[22px] overflow-clip relative shrink-0 w-[20px]" data-name="WaveformIcon">
      <Group />
    </div>
  );
}

function ListenButton() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center relative rounded-[16777200px] shrink-0 size-[40px]" data-name="LISTEN BUTTON">
      <WaveformIcon />
    </div>
  );
}

function Btns() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="BTNS">
      <VoiceInput />
      <ListenButton />
    </div>
  );
}

function RightBtn() {
  return (
    <div className="relative shrink-0 w-[92px]" data-name="RIGHT BTN">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Btns />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white flex-[1_0_0] h-[68px] min-h-px min-w-px relative rounded-[89px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(229,231,235,0.5)] border-solid inset-0 pointer-events-none rounded-[89px] shadow-[0px_8px_30px_0px_rgba(0,0,0,0.12)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[15px] py-px relative size-full">
          <BtnUpload />
          <TextInput />
          <RightBtn />
        </div>
      </div>
    </div>
  );
}

function OuterButton() {
  return (
    <div className="relative shrink-0 size-[54px]" data-name="OUTER BUTTON">
      <div className="absolute inset-[-40.74%_-55.56%_-70.37%_-55.56%]" style={{ "--fill-0": "rgba(255, 255, 255, 1)", "--stroke-0": "rgba(229, 231, 235, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114 114">
          <g filter="url(#filter0_d_2_2443)" id="OUTER BUTTON">
            <mask fill="white" id="path-1-inside-1_2_2443">
              <path d={svgPaths.pf678f00} />
            </mask>
            <path d={svgPaths.pf678f00} fill="var(--fill-0, white)" shapeRendering="crispEdges" />
            <path d={svgPaths.p2596fe00} fill="var(--stroke-0, #E5E7EB)" fillOpacity="0.5" mask="url(#path-1-inside-1_2_2443)" />
            <path d={svgPaths.p36b8a800} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="114" id="filter0_d_2_2443" width="114" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="8" />
              <feGaussianBlur stdDeviation="15" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2_2443" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2_2443" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div className="content-stretch flex gap-[10px] h-[68px] items-center justify-center px-0 py-[5px] relative shrink-0 w-full" data-name="CONTROLS">
      <Card />
      <OuterButton />
    </div>
  );
}

function PromptBarC() {
  return (
    <div className="h-[90px] relative rounded-[100px] shrink-0 w-full" data-name="PROMPT BAR C">
      <div className="content-stretch flex flex-col items-start px-[14px] py-[11px] relative size-full">
        <Controls />
      </div>
    </div>
  );
}

function Project() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[24px] h-full items-center min-h-px min-w-px overflow-clip pb-[24px] pt-0 px-0 relative" data-name="Project">
      <Convo />
      <PromptBarC />
    </div>
  );
}

function CHatCanvasWithProject() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="CHat Canvas with Project">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-start justify-center px-[80px] py-0 relative size-full">
          <Project />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[771px] items-start left-[60px] overflow-clip top-[62px] w-[1285px]">
      <CHatCanvasWithProject />
    </div>
  );
}

export default function B2BChat() {
  return (
    <div className="bg-white relative size-full" data-name="B2B CHAT  3">
      <HighLevelSiteNavAuth />
      <OldB2BNavBarOpenA />
      <Frame3 />
    </div>
  );
}