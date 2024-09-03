package repository;

import dtos.VideoRequestDTO;
import dtos.VideoRequestDetailDTO;
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

    @Inject
    NotificationRepository notificationRepository;

    public List<VideoRequestDetailDTO> getAll() {
        List<VideoRequest> requests = em.createQuery("select vr from VideoRequest vr where vr.status = 'open'", VideoRequest.class).getResultList();

        return requests.stream().map(curr -> {
            Long videoId = curr.getVideo() != null ? curr.getVideo().getContentId() : null;
            return new VideoRequestDetailDTO(curr.getRequestId(), curr.getTitle(), curr.getText(), videoId, curr.getUser(), curr.getStatus());
        }).toList();
    }

    public void createVideoRequest(VideoRequestDTO videoRequestDTO) {
        User user = userRepository.getById(videoRequestDTO.userId());
        VideoRequest videoRequest = new VideoRequest(videoRequestDTO.title(), videoRequestDTO.text(), null, VideoRequestEnum.open, user);
        em.persist(videoRequest);

        List<User> employees = em.createQuery("select u from User u where u.userRole != 'customer'", User.class).getResultList();
        employees.forEach(curr -> {
            VideoRequestNotification notification = new VideoRequestNotification(curr, user, videoRequest.getTitle());
            em.persist(notification);
            notificationRepository.sendConfirmationEmail(notification);
        });
    }

    public void setStatus(Long requestId, Long userId, VideoRequestEnum status, Long videoId) {
        VideoRequest videoRequest = em.find(VideoRequest.class, requestId);
        videoRequest.setStatus(status);
        videoRequest.setVideo(em.find(Video.class, videoId));

        em.merge(videoRequest);

        switch (status) {
            case finished:
                ContentNotification notification = new ContentNotification(videoRequest.getUser(), userRepository.getById(userId), videoRequest.getVideo(), ContentNotificationEnum.finishedRequest);
                em.persist(notification);
                notificationRepository.sendConfirmationEmail(notification);
                break;
            case declined:
                TextNotification textNotification = new TextNotification(videoRequest.getUser(), userRepository.getById(userId), "has declined your video request", videoRequest.getTitle());
                em.persist(textNotification);
                notificationRepository.sendConfirmationEmail(textNotification);
                break;
        }
    }
}
