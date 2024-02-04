// enjoy some ugly js

// used for fake names and stuff
import faker from 'https://esm.run/@luckyluu/fakerjs';

const randNum = upperBoundInclusive => Math.floor(Math.random() * (upperBoundInclusive + 1));
const classes = shuffleArray([
    "AP Spanish",
    "Hon. English",
    "Geoscience",
    "Phys. Ed.",
    "Algebra I",
    "AP Calc. BC",
    "Music Theory",
    "Art Studies",
    "FACS"
]);
const assignments = [
    "Homework",
    "Essay",
    "Worksheet",
    "Notes",
    "Quiz",
    "Writing Response",
    "Study Guide",
    "Video",
    "Presentation",
    "Project",
    "Analysis"
];
const titles = [
    "Mr.",
    "Mr.",
    "Mr.",
    "Mr.",
    "Ms.",
    "Mrs.",
    "Mrs.",
    "Mrs.",
    "Dr.",
    "Dr.",
    "Sir",
];
const teachers = Array(9).fill(null).map(() => titles[randNum(titles.length - 1)] + " " + faker.name.lastName());

const templateElem = document.querySelector(".class-card-wrapper");
for (let i = 0; i < 9; i++) {
    const newNode = templateElem.cloneNode(true);
    newNode.querySelector(".class-card-name").textContent = classes[i];
    newNode.querySelectorAll(".class-card-assignment-list-subsection-title").forEach((elem, elemNum) => {
        let dueDate = 3 + (2 * i % 3) + elemNum * (1 + randNum(2));
        elem.textContent = `Due in ${dueDate} day${dueDate == 1 ? "s" : ""}`;
    });
    newNode.querySelectorAll(".class-card-assignment-list-subsection-elem > a").forEach(elem => {
        elem.textContent = assignments[randNum(assignments.length - 1)];
    });
    newNode.querySelector(".class-card-teacher").textContent = teachers[i];

    const score = (randNum(50) + 50);
    newNode.querySelector(".class-card-score").textContent = score + "%";
    // ternary hell my beloved
    newNode.querySelector(".class-card-score").style.color = score >= 90 
        ? "var(--cblue)"
        : score >= 80
            ? "var(--cgreen)"
            : score >= 70
                ? "var(--cyellow)"
                : "var(--cred)";

    document.querySelector("#class-display-matrix").appendChild(newNode);
}
templateElem.remove();

// stack view
const stackRowTemplate = document.querySelector("#class-stack-row-template");
for (let i = 0; i < 9; i++) {
    const stackRowInstance = stackRowTemplate.cloneNode(true);
    for (const [entryType, entryVal] of [
        ["class", classes[i]],
        ["teacher", teachers[i]],
        ["1q", randNum(50) + 50],
        ["2q", randNum(50) + 50],
        ["midterm", randNum(50) + 50],
        ["semester-grade", randNum(50) + 50],
        ["3q", randNum(50) + 50],
        ["4q", ""],
        ["finals", ""],
        ["class-grade", randNum(50) + 50]
    ]) {
        stackRowInstance.querySelector(".class-stack-row-" + entryType).textContent = entryVal;
    }
    document.querySelector("#class-display-stack").appendChild(stackRowInstance);
}
stackRowTemplate.remove();

// calendar view
const calendarEntryTemplate = document.querySelector("#class-calendar-entry-template");
const auxillaryDays = 4;
const daysInMonth = 29; // 1/48 chance basically
let day = 1;
for (let i = 0; i < 7 * 5; i++) {
    const calendarEntryInstance = calendarEntryTemplate.cloneNode(true);
    document.querySelector("#class-calendar-days").appendChild(calendarEntryInstance);
    if (i < auxillaryDays || i > auxillaryDays + daysInMonth - 1) {
        calendarEntryInstance.classList.add("class-calendar-entry-nulled");
        calendarEntryInstance.textContent = ""; // clears all children
        continue;
    }
    calendarEntryInstance.querySelector(".class-calendar-entry-day").textContent = day;
    document.querySelector("#class-calendar-days").appendChild(calendarEntryInstance);
    day++;
}
calendarEntryTemplate.remove();

// toolbar stuff
;[...document.querySelectorAll(".toolbar-button")].forEach(filterBttn => {
    filterBttn.addEventListener("click", () => {
        document.querySelector(".toolbar-button-focused").classList.remove("toolbar-button-focused");
        filterBttn.classList.add("toolbar-button-focused");
        [...document.querySelectorAll(".view-display")].forEach(classDisplay => {
            classDisplay.style.display = "none";
        })
        document.querySelector("#class-display-" + filterBttn.dataset.target).style.display = "flex";
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

(async () => {
	try {
		const fonts = (await 
			       (
					   await fetch("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCHFuZt0jhA4hKdzTdILMzt9J5h2mR1ltE", { mode: "no-cors" })
				   ).json()
				)
			.items
			.filter(font => {
			    switch (font.category) {
			        case "sans-serif":
					case "serif":
				    case "monospace":
			        return true;
			    }
			})
			.map(font => [font.family, font.files.regular])
			.slice(0, 50);
		const wallpaperUrls = [];
		for (let i = 1; i <= 5; i++) {
			const res = await fetch("https://wallhaven.cc/api/v1/search?categories=110&page=" + i, { mode: "no-cors" });
			const obj = await res.json();
			wallpaperUrls.concat(obj.data.map(imgData => imgData.path));
		}
		
		await Promise.all(
			fonts.map(([fontFamily, fontUrl]) => {
				const ff = new FontFace(
					fontFamily,
					`url(${fontUrl})`
				);
				document.fonts.add(ff);
				return ff.load();
		    })
		);
		
		const wallpapers = await Promise.all(
		    wallpaperUrls.map(async wallpaperUrl => {
			const res = await fetch(wallpaperUrl);
		        const blob = await res.blob();
		        return await new Promise(res => {
		            const r = new FileReader();
		            r.onload = () => res(r.result);
		            r.readAsDataURL(blob);
		        });
		    })
		);
		
		document.querySelector("#special-button").onclick = () => {
		    document.body.style.backgroundImage = "url(" + wallpapers[randNum(wallpapers.length - 1)] + ")";
		    document.documentElement.style.setProperty("--font-body", fonts[randNum(fonts.length - 1)][0]);
		    document.documentElement.style.setProperty("--font-header", fonts[randNum(fonts.length - 1)][0]);
		}
	} catch(e) {
		console.error(e);
	}
})()
