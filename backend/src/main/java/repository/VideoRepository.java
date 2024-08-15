package repository;

import dtos.VideoDetailDTO;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import model.Tag;
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
import java.util.LinkedList;
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

    /*public VideoForUserDTO getAllFromUser(Long userId) {
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
     */

    public Video getById(Long id){
        System.out.println("getById " + id);
        return em.find(Video.class, id);
    }

    public VideoDetailDTO getVideoDetails(Long videoId, Long userId) {
        System.out.println("getVideoDetails user: " + userId + " video: " + videoId);

        Video video = em.find(Video.class, videoId);

        int viewProgressDuration;
        try {
            viewProgressDuration = em.createQuery(
                            "select vp.durationSeconds from ViewProgress vp " +
                                    "where vp.user.userId = :userId " +
                                    "and vp.video.videoId = :videoId", Integer.class)
                    .setParameter("userId", userId)
                    .setParameter("videoId", videoId)
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            viewProgressDuration = 0;
        }

        return new VideoDetailDTO(
            video.getVideoId(),
            video.getTitle(),
            video.getDescription(),
            video.getTags(),
            video.getComments(userId),
            video.getQuestions(),
            video.calculateStarRating(),
            video.getVideoFile(),
            viewProgressDuration
        );
    }

    /**
     * This function is the starting point of video upload process. It takes all further steps to process and store the video.
     *
     * @param file the byte data of the uploaded video from the form on the client
     * @param filename the name of the uploaded video file from the client
     */
    public void uploadVideo(InputStream file, String filename) throws Exception {
        //creates a VideoFile object that identifies and stores all the metadata for the video
        VideoFile videoFile = new VideoFile(filename);
        em.persist(videoFile);

        //temporarily stores the uploaded video in the "uploads" folder so that the ffmpeg tool can process it
        tempSaveVideo(file, videoFile);

        //transform the stored video into smaller chunks that can be streamed one by one
        processVideo(videoFile);

        //remove the now unneeded temporary video file
        removeUploadedVideo(videoFile);
    }

    /**
     * Takes the uploaded byte data from the form on the client and writes it into a single video file in the "uploads"
     * folder. This file is temporary and is only used as an input for further processing by ffmpeg - see "processVideo()"
     *
     * @param uploadedInputStream byte data of the uploaded video
     * @param videoFile contains an id for and file extension of the uploaded video
     */
    public void tempSaveVideo(InputStream uploadedInputStream, VideoFile videoFile) throws Exception {
        try (FileOutputStream out = new FileOutputStream("uploads" + File.separator + "upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension())) {
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

    /**
     * Removes the initial uploaded single video file from the "uploads" folder
     * @param videoFile identifies the video file to be removed
     */
    public void removeUploadedVideo(VideoFile videoFile){
        File file = new File("uploads" + File.separator + "upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension());
        file.delete();
    }

    /**
     * Process the video file to create a DASH manifest and video chunks (web technology for streaming video)
     * the chunks will be requested one by one, by the client - see "getVideoChunk()".
     * Additionally, metadata is extracted from the video and stored in the videoFile object.
     *
     * For these tasks the ffmpeg tool and a wrapper library is used.
     *
     * @param videoFile contains id and file extension of the uploaded video
     */
    public void processVideo(VideoFile videoFile) {

        String filePath = "uploads" + File.separator + "upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension();

        try {
            FFmpeg ffmpeg = new FFmpeg("tools" + File.separator + "ffmpeg.exe");
            FFprobe ffprobe = new FFprobe("tools" + File.separator + "ffprobe.exe");

            //TODO really fancy bug.. when uploading a mkv and possibly other formats the duration is not read correctly
            //read metadata from videofile and store them in the db
            FFmpegProbeResult probeResult = ffprobe.probe(filePath);
            FFmpegStream stream = probeResult.getStreams().get(0);
            videoFile.setDurationSeconds((long) stream.duration);
            //get the size of the file and write to the videoFile
            videoFile.setSizeBytes(new File(filePath).length());

            //creates a directory for the video chunks to be stored in
            new File("processed" + File.separator + "video-" + videoFile.getVideoFileId()).mkdirs();

            //transform the temporary stored videos into a DASH manifest and chunks
            FFmpegBuilder builder = new FFmpegBuilder()
                .setInput(filePath)
                .overrideOutputFiles(false)

                .addOutput("processed/" + "video-" + videoFile.getVideoFileId() +"/manifest.mpd")
                .setFormat("dash")

                .setAudioCodec("copy")
                .setVideoCodec("copy")

                //arguments for the exact format of the chunks and manifest
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

    /**
     * This function is called by the streamer in the client to request small chunks of the video one by one. By doing
     * this, the client doesn't have to download all 20 minutes of a given video all at once but can instead request the
     * next 2 chunks or so and when the first chunk is watched, request the next one.
     *
     * @param videoId chunk names aren't unique and therefore need to be identified by the videoId they belong to
     * @param fileName the streamer in the frontend reads the name of the next chunk from the manifest file and passes this along
     *
     * @return the requested video chunk
     */
    public File getVideoFragment(Long videoId, String fileName) throws Exception {
        Video video = em.find(Video.class, videoId);
        return new File("processed" + File.separator + "video-" + video.getVideoFile().getVideoFileId() + File.separator + fileName);
    }

    /**
     * Links a given videoFile(identifies the actual file and stores metadata) to a Video(stores description, title, tags, comments etc.)
     * This is necessary because the upload process should not be dependent on a specific video in case the upload gets cancelled or simmilar.
     * Also, because the videoFile is created before the video itself.
     *
     * @param videoId
     * @param fileId
     */
    public void linkVideoFile(Long videoId, Long fileId) {
        Video video = em.find(Video.class, videoId);
        VideoFile videoFile = em.find(VideoFile.class, fileId);
        video.setVideoFile(videoFile);
    }
}
