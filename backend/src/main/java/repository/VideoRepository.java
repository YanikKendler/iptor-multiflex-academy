package repository;

import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Video;

import java.util.List;

@ApplicationScoped
public class VideoRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(Video video) {
        em.persist(video);
    }

    @Transactional
    public void update(Video video) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<VideoOverviewDTO> getAll() {
        List<Video> videos = em.createQuery("select v from Video v", Video.class).getResultList();

        return videos.stream()
                .map(v -> new VideoOverviewDTO(v.getVideoId(), v.getTitle(), v.getDescription(), v.getTags(), v.getColor(), v.getDurationSeconds()))
                .toList();
    }

    public Video getById(Long id){
        return em.find(Video.class, id);
    }
}
