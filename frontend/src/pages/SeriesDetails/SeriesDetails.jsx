import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiBaseUrlL, apiEndpoints } from "../../constants/api";
import styles from "./SeriesDetails.module.css";

const SeriesDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [series, setSeries] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [episodes, setEpisodes] = useState({});
    const [expandedSeasons, setExpandedSeasons] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [loadingSeasons, setLoadingSeasons] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeriesDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${apiBaseUrlL}${apiEndpoints.SERIES.details}?id=${id}`
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log("Series details response:", data);
                    setSeries(data);

                    await fetchSeasons();
                } else {
                    setError("Série não encontrada");
                }
            } catch (err) {
                console.error("Erro ao buscar detalhes da série:", err);
                setError("Erro ao carregar detalhes da série");
            } finally {
                setLoading(false);
            }
        };

        const fetchSeasons = async () => {
            try {
                const seasonsToTry = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                const validSeasons = [];

                for (const seasonNum of seasonsToTry) {
                    try {
                        const response = await fetch(
                            `${apiBaseUrlL}${apiEndpoints.SERIES.seasons}?seriesId=${id}&season=${seasonNum}`
                        );

                        if (response.ok) {
                            const data = await response.json();
                            console.log(`Season ${seasonNum} response:`, data);

                            if (
                                data.success !== false &&
                                data.episodes &&
                                data.episodes.length > 0
                            ) {
                                validSeasons.push({
                                    seasonNumber: seasonNum,
                                    totalSeasons: data.totalSeasons,
                                    year: data.year,
                                    episodes: data.episodes,
                                });
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    } catch (err) {
                        console.error(
                            `Erro ao buscar temporada ${seasonNum}:`,
                            err
                        );
                        break;
                    }
                }

                setSeasons(validSeasons);
            } catch (err) {
                console.error("Erro ao buscar temporadas:", err);
            }
        };

        if (id) {
            fetchSeriesDetails();
        }
    }, [id]);

    const fetchEpisodes = async (seasonNumber) => {
        if (episodes[seasonNumber]) {
            return;
        }

        setLoadingSeasons((prev) => ({ ...prev, [seasonNumber]: true }));

        try {
            const response = await fetch(
                `${apiBaseUrlL}${apiEndpoints.SERIES.seasons}?seriesId=${id}&season=${seasonNumber}`
            );

            if (response.ok) {
                const data = await response.json();
                console.log(`Episodes for season ${seasonNumber}:`, data);

                if (data.success !== false && data.episodes) {
                    setEpisodes((prev) => ({
                        ...prev,
                        [seasonNumber]: data.episodes,
                    }));
                }
            }
        } catch (err) {
            console.error(
                `Erro ao buscar episódios da temporada ${seasonNumber}:`,
                err
            );
        } finally {
            setLoadingSeasons((prev) => ({ ...prev, [seasonNumber]: false }));
        }
    };

    const toggleSeason = async (seasonNumber) => {
        const newExpanded = new Set(expandedSeasons);

        if (expandedSeasons.has(seasonNumber)) {
            newExpanded.delete(seasonNumber);
        } else {
            newExpanded.add(seasonNumber);

            const season = seasons.find((s) => s.seasonNumber === seasonNumber);
            if (season && season.episodes) {
                setEpisodes((prev) => ({
                    ...prev,
                    [seasonNumber]: season.episodes,
                }));
            } else {
                await fetchEpisodes(seasonNumber);
            }
        }

        setExpandedSeasons(newExpanded);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Carregando detalhes...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <h2>Erro</h2>
                    <p>{error}</p>
                    <button
                        onClick={handleGoBack}
                        className={styles.backButton}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    if (!series) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <i className="fas fa-tv"></i>
                    <h2>Série não encontrada</h2>
                    <button
                        onClick={handleGoBack}
                        className={styles.backButton}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={handleGoBack} className={styles.backButton}>
                <i className="fas fa-arrow-left"></i>
                Voltar
            </button>

            <div className={styles.seriesDetails}>
                <div className={styles.posterSection}>
                    <img
                        src={
                            series.poster !== "N/A"
                                ? series.poster
                                : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80"
                        }
                        alt={series.title}
                        className={styles.poster}
                    />
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{series.title}</h1>
                        <div className={styles.badges}>
                            <span className={styles.badge}>
                                <i className="fas fa-tv"></i>
                                Série
                            </span>
                            {series.year && (
                                <span className={styles.badge}>
                                    <i className="fas fa-calendar"></i>
                                    {series.year}
                                </span>
                            )}
                            {seasons.length > 0 && (
                                <span className={styles.badge}>
                                    <i className="fas fa-layer-group"></i>
                                    {seasons.length} Temporada
                                    {seasons.length !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>

                    {series.plot && (
                        <div className={styles.section}>
                            <h3>Sinopse</h3>
                            <p>{series.plot}</p>
                        </div>
                    )}

                    {series.genre && (
                        <div className={styles.section}>
                            <h3>Gênero</h3>
                            <p>{series.genre}</p>
                        </div>
                    )}

                    {series.actors && (
                        <div className={styles.section}>
                            <h3>Elenco</h3>
                            <p>{series.actors}</p>
                        </div>
                    )}

                    {series.imdbRating && (
                        <div className={styles.section}>
                            <h3>Avaliação IMDb</h3>
                            <p>{series.imdbRating}/10</p>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button className={styles.watchButton}>
                            <i className="fas fa-play"></i>
                            Assistir
                        </button>
                        <button className={styles.favoriteButton}>
                            <i className="fas fa-heart"></i>
                            Adicionar aos Favoritos
                        </button>
                    </div>
                </div>
            </div>

            {/* Temporadas */}
            {seasons.length > 0 && (
                <div className={styles.seasonsSection}>
                    <h2 className={styles.seasonsTitle}>
                        <i className="fas fa-layer-group"></i>
                        Temporadas
                    </h2>

                    <div className={styles.seasonsList}>
                        {seasons.map((season) => (
                            <div
                                key={season.seasonNumber}
                                className={styles.seasonItem}
                            >
                                <button
                                    className={styles.seasonHeader}
                                    onClick={() =>
                                        toggleSeason(season.seasonNumber)
                                    }
                                >
                                    <div className={styles.seasonInfo}>
                                        <span className={styles.seasonNumber}>
                                            Temporada {season.seasonNumber}
                                        </span>
                                        <span className={styles.seasonDetails}>
                                            {season.episodes &&
                                                `${season.episodes.length} episódios`}
                                            {season.year && ` • ${season.year}`}
                                        </span>
                                    </div>
                                    <i
                                        className={`fas fa-chevron-down ${
                                            expandedSeasons.has(
                                                season.seasonNumber
                                            )
                                                ? styles.expanded
                                                : ""
                                        }`}
                                    ></i>
                                </button>

                                {expandedSeasons.has(season.seasonNumber) && (
                                    <div className={styles.episodesList}>
                                        {loadingSeasons[season.seasonNumber] ? (
                                            <div
                                                className={
                                                    styles.episodesLoading
                                                }
                                            >
                                                <i className="fas fa-spinner fa-spin"></i>
                                                <span>
                                                    Carregando episódios...
                                                </span>
                                            </div>
                                        ) : episodes[season.seasonNumber] ? (
                                            episodes[season.seasonNumber].map(
                                                (episode, index) => (
                                                    <div
                                                        key={
                                                            episode.episode ||
                                                            index
                                                        }
                                                        className={
                                                            styles.episodeItem
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.episodeNumber
                                                            }
                                                        >
                                                            EP{" "}
                                                            {episode.episode ||
                                                                index + 1}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.episodeInfo
                                                            }
                                                        >
                                                            <h4
                                                                className={
                                                                    styles.episodeTitle
                                                                }
                                                            >
                                                                {episode.title ||
                                                                    `Episódio ${
                                                                        episode.episode ||
                                                                        index +
                                                                            1
                                                                    }`}
                                                            </h4>
                                                            {episode.plot && (
                                                                <p
                                                                    className={
                                                                        styles.episodePlot
                                                                    }
                                                                >
                                                                    {
                                                                        episode.plot
                                                                    }
                                                                </p>
                                                            )}
                                                            <div
                                                                className={
                                                                    styles.episodeMetadata
                                                                }
                                                            >
                                                                {episode.released && (
                                                                    <span
                                                                        className={
                                                                            styles.episodeDate
                                                                        }
                                                                    >
                                                                        <i className="fas fa-calendar"></i>
                                                                        {
                                                                            episode.released
                                                                        }
                                                                    </span>
                                                                )}
                                                                {episode.imdbRating && (
                                                                    <span
                                                                        className={
                                                                            styles.episodeRating
                                                                        }
                                                                    >
                                                                        <i className="fas fa-star"></i>
                                                                        {
                                                                            episode.imdbRating
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className={styles.noEpisodes}>
                                                <i className="fas fa-info-circle"></i>
                                                <span>
                                                    Nenhum episódio encontrado
                                                    para esta temporada
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeriesDetails;
