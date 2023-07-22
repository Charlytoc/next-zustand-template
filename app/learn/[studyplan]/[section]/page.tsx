'use client'
import Footer from "@/app/resources/components/ui/Footer";
import NavBar from "@/app/resources/components/ui/NavBar";
import { themes, useStore } from "@/app/resources/context/store";
import { topics } from "@/app/resources/files/topics";
import { useState, useEffect } from "react";
import axios from "axios";


interface ISectionPageProps {
    params: {
        section: string;
    }
}

const defaultSection = {
    id: 0,
    title: "",
    objective: "",
    topics: [
        {
            explanation: "",
            title: "",
            objective: "",
        }
    ]
}

export default function SectionPage(props:ISectionPageProps) {
    const { settings } = useStore()
    const [section, setSection] = useState(defaultSection)

    const getSectionById = async () => {
        const token = '1EfGWWhkijtac7d0S0UL'; // Replace with your actual token
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        try {
            const response = await axios.get(`${API_URL}/v1/learning/section/${props.params.section}`);
            setSection(response.data)
            console.log(response.data);
            
        } catch (error) {
          console.error('Error sending study plan:', error);
        }
    }

    const createTopicsFromSection = async () => {
        const token = '1EfGWWhkijtac7d0S0UL'; // Replace with your actual token
        const API_URL = process.env.NEXT_PUBLIC_API_URL

        try {
            const response = await axios.post(`${API_URL}/v1/learning/section/${props.params.section}`);
            setSection(response.data)
        } catch (error) {
          console.error('Error sending study plan:', error);
        }
    }

    useEffect(()=>{
        getSectionById()
    }, [])
    return (
        <main className={`page page-section ${settings.theme}`}>
            <NavBar />
            <h2>{section.title}</h2>
            <p>{section.objective}</p>
       
            {section.topics.length < 1
             ? <button onClick={createTopicsFromSection}>Create topics</button>
            :<TopicCarousel topics={section.topics}/>}
            
            <Footer />
        </main>
    )
}

interface ITopic {
    explanation: string
    title: string
    objective: string
}

interface ITopicCarouselProps {
    topics: Array<ITopic>
}

const TopicCarousel = (props: ITopicCarouselProps) => {
    const [currentIndex, setCurrentIndex]  =useState(0)

    const handleTopicChange = (difference: number) => {
        const topicsLength = props.topics.length;
        let newTopic = (currentIndex + difference + topicsLength) % topicsLength;
        setCurrentIndex(newTopic)
    }

    return (
        <div className="component-topic-carousel">
            
            <TopicComponent topic={props.topics[currentIndex]} />
            <div className="actions">
                <button onClick={()=>handleTopicChange(-1)}>Previous</button>
                <button onClick={()=>handleTopicChange(1)}>Next</button>
                <span>{currentIndex +1} / {props.topics.length}</span>
            </div>
        </div>
    )
}

interface ITopicComponentProps {
    topic: ITopic
}

const TopicComponent = (props:ITopicComponentProps) => {
    return (
        <div className="component-topic">
            <h3>{props.topic.title}</h3>
            {/* <h6>{props.topic.objective}</h6> */}
            <p>{props.topic.explanation}</p>
        </div>
    )
}