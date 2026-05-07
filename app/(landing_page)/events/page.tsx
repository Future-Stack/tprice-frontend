import EventsHero from "./components/EventsHero";
import EventsList from "./components/EventsList";
import EventsGallery from "./components/EventsGallery";
import ScrollToTop from "../components/ScrollToTop";

export default function EventsPage() {
  return (
    <main className="bg-black">
      <EventsHero />
      <EventsList />
      <EventsGallery />
      <ScrollToTop />
    </main>
  );
}