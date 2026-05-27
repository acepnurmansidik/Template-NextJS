import Education from "@/components/etc/portofolio/Education";
import Experience from "@/components/etc/portofolio/Experience";
import Footer from "@/components/etc/portofolio/Footer";
import Hero from "@/components/etc/portofolio/Hero";
import Navbar from "@/components/etc/portofolio/Navbar";
import Projects from "@/components/etc/portofolio/Project";
import Skills from "@/components/etc/portofolio/Skills";
import Testimonials from "@/components/etc/portofolio/Testimonial";
import { EducationsDaum, ExperiencesDaum } from "@/types/profile";

export default function Home() {
  const experiences: ExperiencesDaum[] = [
    {
      role: "DevOps Engineer",
      start_date: "Feb 2024",
      end_date: "Feb 2025",
      company_name: "PT. Nashta Global Utama",
      type: "Remote Fulltime",
      description: "",
      list_task: [
        "Manage the servers required for application needs, ensuring that the infrastructure is always available and reliable.",
        "Create CI/CD pipelines using GitLab with Bash scripting to automate the build, testing, and deployment processes of applications",
        "Deploy frontend and backend applications to the production environment, ensuring that all components function properly and are well-integrated.",
        "Distribute mobile applications to the Play Store and App Store, following the guidelines set by each platform to ensure a smooth upload process.",
        "Manage servers on AWS, leveraging available services to ensure the scalability and security of applications.",
        "Collaborate with the development team to address any issues that arise with the applications, ensuring timely resolutions and maintaining overall system stability.",
      ],
    },
    {
      role: "BackEnd Developer",
      start_date: "Feb 2023",
      end_date: "Feb 2024",
      company_name: "PT. Nashta Global Utama",
      type: "Fulltime",
      description: "",
      list_task: [
        "Utilize Swagger for API documentation, facilitating clear communication and easy integration with external systems.",
        "Deploy the backend applications to the production environment, ensuring stability and performance.",
        "Implement fixes for bugs that could cause the application to crash or malfunction.",
        "Design and develop applications with a focus on making maintenance easier and more efficient.",
        "Ensure seamless integration between the backend, frontend, and mobile applications.",
        "Involved in the development of a microservices-based backend architecture for Nashtanet, an internal ERP application.",
        "Migrate applications from NestJS to Go, ensuring a smooth transition and improved performance.",
        "Implement fixes in the legacy code during the migration process to enhance functionality and maintain stability.",
      ],
    },
    {
      role: "BackEnd Developer",
      start_date: "Jun 2022",
      end_date: "Des 2022",
      company_name: "MG Indotech",
      type: "Fulltime",
      description: "",
      list_task: [
        "play a key role in the development of the application architecture for the BMS system, which operates in the property sector to manage apartments.",
        "Ensure seamless integration of the application from the back-end to the front-end and mobile platforms.",
        "Design and develop applications with a focus on simplifying maintenance and enhancing efficiency.",
        "Address and resolve errors that could cause the application to crash or malfunction.",
        "Deploy the applications to the production stage, ensuring they are stable and ready for use.",
      ],
    },
    {
      role: "IT Support Network Engineer",
      start_date: "Jan 2022",
      end_date: "Jun 2022",
      company_name: "Diskominfo Kota Tasikmalaya",
      type: "Fulltime",
      description: "",
      list_task: [
        "Solve internet connection problems to ensure users have reliable access to online resources.",
        "Troubleshoot devices' internet connections, identifying and resolving issues to restore connectivity.",
        "Regularly check internet connections to proactively identify potential issues before they affect users..",
        "Maintain telephone cable equipment to ensure optimal performance and reliability of communication systems.",
      ],
    },
    {
      role: "IT Support",
      start_date: "Oct 2019",
      end_date: "Nov 2019",
      company_name: "PT. Urgensi  Inovasi Dunia",
      type: "Internship",
      description: "",
      list_task: [
        "Build the Battery Healthy website to provide users with valuable information and resources.",
        "Create corporate documentaries to showcase the company's initiatives and achievements.",
        "Edit videos and upload them to YouTube, ensuring high-quality content is available for our audience.",
      ],
    },
    {
      role: "IT Support Intern",
      start_date: "Dec 2015",
      end_date: "Feb 2016",
      company_name: "PT. Sampoerna Telekomunikasi Indonesia",
      type: "Internship",
      description: "",
      list_task: [
        "Solve internet connection problems to ensure users have reliable access to online services.",
        "Troubleshoot devices' internet connections, diagnosing and resolving issues to restore connectivity.",
        "Regularly check internet connections to proactively identify and address potential issues.",
        "Maintain telephone cable equipment to ensure optimal performance and reliability of communication systems.",
        "Installation telephone lines to support effective communication within the organization.",
      ],
    },
  ];

  const educations: EducationsDaum[] = [
    {
      school_name: "Universitas Komputer Indonesia",
      degree: "Associate Degree (D3)",
      start_date: "2017",
      end_date: "2020",
      description: "",
    },
    {
      school_name: "SMKN 6 Garut",
      degree: "Network & Computer Engineering",
      start_date: "2014",
      end_date: "2017",
      description: "",
    },
  ];
  return (
    <main className="w-full min-h-screen bg-gray-50 scrollbar-hide">
      <Navbar />
      <Hero />
      <Skills />
      <Experience initiateData={experiences} />
      <Education initiateData={educations} />
      {/* <Projects /> */}
      {/* <Testimonials /> */}
      <Footer />
    </main>
  );
}
