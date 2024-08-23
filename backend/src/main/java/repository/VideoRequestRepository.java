package repository;

import dtos.VideoRequestDTO;
import enums.ContentNotificationEnum;
import enums.VideoRequestEnum;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.*;

import java.util.List;

@Transactional
@ApplicationScoped
public class VideoRequestRepository {
    @Inject
    EntityManager em;

    @Inject
    UserRepository userRepository;


    public List<VideoRequest> getAll() {
        return em.createQuery("select vr from VideoRequest vr where vr.status != 'finished'", VideoRequest.class).getResultList();
    }

    public void createVideoRequest(VideoRequestDTO videoRequestDTO) {
        User user = userRepository.getById(videoRequestDTO.userId());
        VideoRequest videoRequest = new VideoRequest(videoRequestDTO.title(), videoRequestDTO.text(), null, VideoRequestEnum.open, user);
        em.persist(videoRequest);

        List<User> employees = em.createQuery("select u from User u where u.userRole != 'customer'", User.class).getResultList();
        employees.forEach(curr -> {
            em.persist(new VideoRequestNotification(curr, user, videoRequest.getTitle()));
        });
    }

    public void setStatus(Long requestId, Long userId, VideoRequestEnum status, Long videoId) {
        VideoRequest videoRequest = em.find(VideoRequest.class, requestId);
        videoRequest.setStatus(status);
        videoRequest.setVideo(em.find(Video.class, videoId));

        em.merge(videoRequest);

        switch (status) {
            case finished:
                em.persist(new ContentNotification(videoRequest.getUser(), userRepository.getById(userId), videoRequest.getVideo(), ContentNotificationEnum.finishedRequest));
                break;
            case declined:
                em.persist(new TextNotification(videoRequest.getUser(), userRepository.getById(userId), "has declined your video request:", videoRequest.getTitle()));
                break;
        }
    }
}
