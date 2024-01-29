// enjoy some ugly js

// used for fake names and stuff
import faker from 'https://esm.run/@luckyluu/fakerjs';

const randNum = upperBoundInclusive => Math.floor(Math.random() * (upperBoundInclusive + 1));
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
for (let i = 0; i < 9; i++) {
    const newNode = document.querySelector(".class-card-wrapper").cloneNode(true);
    newNode.querySelector(".class-name").textContent = [
        "AP Language V",
        "Honors English",
        "Geoscience",
        "Physical Education",
        "Algebra I",
        "Soccer",
        "Music Theory",
        "Contemporary Art"
    ][i];
    newNode.querySelectorAll(".class-card-assignment-list-subsection-title").forEach((elem, elemNum) => {
        elem.textContent = `Due in ${[
            (2 + (2 * i % 6)) + elemNum * 2 // random formula i made up on the spot
        ][i]} days`;
    });
    newNode.querySelectorAll(".class-card-assignment-list-subsection-elem > a").forEach(elem => {
        elem.textContent = assignments[randNum(assignments.length - 1)];
    });
    document.querySelector("#class-display-matrix").appendChild(newNode);
    newNode.querySelector(".class-teacher").textContent = faker.name.firstName() + " " + faker.name.lastName();

    const score = (randNum(50) + 50);
    newNode.querySelector(".class-teacher").textContent = score + "%";
    // ternary hell my beloved
    newNode.querySelector(".class-teacher").style.color = score >= 90 
        ? "var(--cblue)"
        : score >= 80
            ? "var(--cgreen)"
            : score >= 70
                ? "var(--cyellow)"
                : "var(--cred)";
}
