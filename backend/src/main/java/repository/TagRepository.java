package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Tag;

import java.util.List;

@ApplicationScoped
public class TagRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(Tag tag) {
        em.persist(tag);
    }

    @Transactional
    public void update(Tag tag) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<Tag> getAll() {
        return em.createQuery("select t from Tag t", Tag.class).getResultList();
    }

    public Tag getById(Long id){
        return em.find(Tag.class, id);
    }
}
