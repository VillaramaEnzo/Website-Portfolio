// Socials Metadata
// ------------------------------------------------------------
export interface socialLink {
    href: string
    icon: string
    label: string
  }
  
  // Eventually handle this better for privacy reasons
  const ig = "___e_vil"
  const linkedin = "enzo-villarama"
  const github = "VillaramaEnzo"
  const linktree = "___e_vil"
  const email = "ienzovillarama@gmail.com"

  export const links: socialLink[] = [
    {
      href: `https://www.instagram.com/${ig}`,
      icon: "instagram",
      label: "Instagram",
    },
    {
      href: `https://www.linkedin.com/in/${linkedin}`,
      icon: "linkedin",
      label: "LinkedIn",
    },
    {
      href: `https://github.com/${github}`,
      icon: "github",
      label: "GitHub"
    },
    {
      href: `https://linktr.ee/${linktree}`,
      icon: "linktree",
      label: "Linktree",
    }
  ]

export const aboutMe = {

  name: "Enzo Villarama",
  title: "Creative Design Engineer",
  description: "I'm a creative design engineer with a passion for creating impactful user experiences.",
  skills: [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe InDesign",
    "Adobe XD",
  ],
  interests: [
    "Design",
    "Development",
    "Art",
    "Music",
    "Travel",
    "Food",
  ],
  hobbies: [
    "Photography",
    "Videography",
    "Music Production",
    "Travel",
    "Food",
  ]

}

// Homepage Content
// ------------------------------------------------------------
export const homePageContent = {
  intro: {
    greeting: "Hi, I'm Enzo",
    paragraphs: [
      {
        text: "Creative technologist exploring digital systems, identity, and self-directed work. Currently building ",
        link: { text: "project: BLANK", href: "https://www.instagram.com/project_bl_nk" },
        textAfter: " – More soon."
      },
      {text: "I’m interested in the space between ideas and execution — where things are built, shaped, and defined through process."},
      {
        text: "I grew up in New Zealand and am currently based in Manila, Philippines. You can keep up with me on ",
        link: { text: "Instagram", href: `https://www.instagram.com/___e_vil` },
        textAfter: " or feel free to send me an ",
        link2: { text: "Email", href: `mailto:${email}` },
        textAfter2: "."
      }
    ]
  },
  cta: {
    prompt: "Got a project in mind?",
    heading: "Let's talk!",
    mailto: `mailto:${email}`
  }
}
