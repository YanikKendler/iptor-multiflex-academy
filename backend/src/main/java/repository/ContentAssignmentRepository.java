package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.ContentAssignment;

import java.util.List;

@ApplicationScoped
public class ContentAssignmentRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(ContentAssignment contentAssignment) {
        em.persist(contentAssignment);
    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    @Transactional
    public void update(ContentAssignment contentAssignment) {
        em.merge(contentAssignment);
    }

    public List<ContentAssignment> getAll() {
        return em.createQuery("select v from ContentAssignment v", ContentAssignment.class).getResultList();
    }

    public ContentAssignment getById(Long id){
        return em.find(ContentAssignment.class, id);
    }
}
