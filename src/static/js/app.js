import EmblaCarousel from "embla-carousel";
import { setupPrevNextBtns, disablePrevNextBtns } from "./prevAndNextButtons";
import "../css/base.css";
import "../css/reset.css";
import "../css/embla.css";
import "../css/header.css";
import "../css/footer.css";

const wrap = document.querySelector(".embla");
const viewPort = wrap.querySelector(".embla__viewport");
const prevBtn = wrap.querySelector(".embla__button--prev");
const nextBtn = wrap.querySelector(".embla__button--next");
const embla = EmblaCarousel(viewPort, { align: "center", skipSnaps: false });
const disablePrevAndNextBtns = disablePrevNextBtns(prevBtn, nextBtn, embla);

setupPrevNextBtns(prevBtn, nextBtn, embla);

embla.on("select", disablePrevAndNextBtns);
embla.on("init", disablePrevAndNextBtns);