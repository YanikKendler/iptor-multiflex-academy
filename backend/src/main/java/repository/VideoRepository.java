package repository;

import dtos.VideoForUserDTO;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Video;
import model.VideoFile;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import net.bramp.ffmpeg.probe.FFmpegStream;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Transactional
@ApplicationScoped
public class VideoRepository {
    @Inject
    EntityManager em;

    public void create(Video video) {
        em.persist(video);
    }

    public void update(Video video) {}

    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<VideoOverviewDTO> getAll() {
        List<Video> videos = em.createQuery("select v from Video v order by v.videoId", Video.class).getResultList();

        return videos.stream()
                .map(v -> new VideoOverviewDTO(
                        v.getVideoId(),
                        v.getTitle(),
                        v.getDescription(),
                        v.getTags(),
                        v.getColor(),
                        v.getVideoFile() != null ? v.getVideoFile().getDurationSeconds() : null
                ))
                .toList();
    }

    /**public VideoForUserDTO getAllFromUser(Long userId) {
        List<VideoOverviewDTO> continueVideos = null;
        List<VideoOverviewDTO> assignedVideos = null;
        List<VideoOverviewDTO> suggestedVideos = null;

        try {
            continueVideos = em.createQuery("select new dtos.VideoOverviewDTO(v.videoId as videoId, v.title as title, v.description as description, v.tags as tags, v.color as color, v.durationSeconds as durationSeconds, vp as progress)" +
                            " from Video v join ViewProgress vp on v.id = vp.video.id where vp.user.userId = :userId", VideoOverviewDTO.class)
                    .setParameter("userId", userId).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            assignedVideos = em.createQuery("select new dtos.VideoOverviewDTO(v.videoId as videoId, v.title as title, v.description as description, v.tags as tags, v.color as color, v.durationSeconds as durationSeconds, vp as progress)" +
                            " from Video v join VideoAssignment va on v.id = va.video.id" +
                            " join ViewProgress  vp on v.id = vp.video.id where va.assignedTo.userId = :userId", VideoOverviewDTO.class)
                    .setParameter("userId", userId).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new VideoForUserDTO(continueVideos, assignedVideos, suggestedVideos);
    }
     **/

    public Video getById(Long id){
        return em.find(Video.class, id);
    }


    public void uploadVideo(InputStream file, String filename) throws Exception {
        VideoFile videoFile = new VideoFile(filename);
        em.persist(videoFile);

        saveVideo(file, videoFile);

        processVideo(videoFile);

        removeUploadedVideo(videoFile);
    }

    public void saveVideo(InputStream uploadedInputStream, VideoFile videoFile) throws Exception {
        try (FileOutputStream out = new FileOutputStream("uploads/upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension())) {
            int read;
            byte[] bytes = new byte[1024];
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void removeUploadedVideo(VideoFile videoFile){
        File file = new File("uploads/upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension());
        file.delete();
    }

    public void processVideo(VideoFile videoFile) {
        new File("processed/video-" + videoFile.getVideoFileId()).mkdirs();

        String filePath = "uploads/upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension();

        try {
            FFmpeg ffmpeg = new FFmpeg("tools/ffmpeg.exe");
            FFprobe ffprobe = new FFprobe("tools/ffprobe.exe");

            FFmpegProbeResult probeResult = ffprobe.probe(filePath);
            FFmpegStream stream = probeResult.getStreams().get(0);
            videoFile.setDurationSeconds((long) stream.duration);
            //get the size of the file and write to the videoFile
            videoFile.setSizeBytes(new File(filePath).length());

            FFmpegBuilder builder = new FFmpegBuilder()
                .setInput(filePath)
                .overrideOutputFiles(false)

                .addOutput("processed/video-" + videoFile.getVideoFileId() + "/source.mpd")
                .setFormat("dash")

                .setAudioCodec("copy")
                .setVideoCodec("copy")

                .addExtraArgs("-min_seg_duration", "30")
                .addExtraArgs("-use_template", "1")
                .addExtraArgs("-use_timeline", "1")
                .addExtraArgs("-init_seg_name", "$RepresentationID$-init.m4s")
                .addExtraArgs("-media_seg_name", "$RepresentationID$-$Time$.m4s")
                .done();

            FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);

            executor.createJob(builder).run();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public File getVideoChunk(Long videoId, String fileName) throws Exception {
        Video video = em.find(Video.class, videoId);
        return new File("processed/video-" + video.getVideoFile().getVideoFileId() + "/" + fileName);
    }

    public void linkVideoFile(Long videoId, Long fileId) {
        Video video = em.find(Video.class, videoId);
        VideoFile videoFile = em.find(VideoFile.class, fileId);
        video.setVideoFile(videoFile);
    }
}
