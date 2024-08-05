package repository;

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

    public List<Video> getAll() {
        return em.createQuery("select v from Video v", Video.class).getResultList();
    }

    public Video getById(Long id){
        return em.find(Video.class, id);
    }
}
