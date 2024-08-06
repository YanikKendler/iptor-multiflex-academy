package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.VideoAssignment;

import java.util.List;

@ApplicationScoped
public class VideoAssignmentRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(VideoAssignment videoAssignment) {
        em.persist(videoAssignment);
    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    @Transactional
    public void update(VideoAssignment videoAssignment) {
        em.merge(videoAssignment);
    }

    public List<VideoAssignment> getAll() {
        return em.createQuery("select v from VideoAssignment v", VideoAssignment.class).getResultList();
    }

    public VideoAssignment getById(Long id){
        return em.find(VideoAssignment.class, id);
    }
}
