import React, { useMemo, useState } from "react";

interface VideoIdea {
    title: string;
    expectedViews: string;
    reason: string;
}

interface TrendingVideo {
    title: string;
    views: string;
    engagement: string;
    tags: string[];
}

interface NicheProfile {
    name: string;
    trendingTags: string[];
    hotIdeas: VideoIdea[];
    winningVideos: TrendingVideo[];
}

interface ChannelVideo {
    title: string;
    views: string;
    ctr: number;
    seoScore: number;
    tags: string[];
    niche: string;
}

interface ChannelProfile {
    id: string;
    name: string;
    niche: string;
    subscribers: string;
    videos: number;
    avgCtr: number;
    avgSeoScore: number;
    tags: string[];
    videosPublishedMonthly: number;
    bestPerforming: ChannelVideo[];
}

interface AnalysisResult {
    seoScore: number;
    ctrScore: number;
    retentionScore: number;
    recommendedTags: string[];
    summary: string;
    keywordCoverage: { keyword: string; weight: number }[];
}

const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "for",
    "to",
    "of",
    "in",
    "on",
    "with",
    "how",
    "what",
    "why",
    "is",
    "are",
    "from",
    "by",
    "you",
    "your",
]);

const nicheProfiles: NicheProfile[] = [
    {
        name: "Tecnología",
        trendingTags: ["tutorial", "ai", "productividad", "review", "automatización", "apps", "mac", "windows"],
        hotIdeas: [
            {
                title: "Automatiza tu jornada con IA (20 flujos reales)",
                expectedViews: "65k - 90k",
                reason: "Combina productividad con IA, dos temas de búsquedas crecientes en 2024.",
            },
            {
                title: "Las 10 extensiones de Chrome que usan los creadores profesionales",
                expectedViews: "48k - 70k",
                reason: "Listas accionables con palabras clave evergreen y ejemplos concretos.",
            },
            {
                title: "Review honesta del portátil creador 2024 (rendimiento vs. precio)",
                expectedViews: "35k - 55k",
                reason: "Mezcla intención de compra con transparencia, lo que mejora el CTR orgánico.",
            },
        ],
        winningVideos: [
            {
                title: "Productividad con IA: 7 atajos para editar más rápido",
                views: "112k",
                engagement: "12.4% CTR • 72% retención",
                tags: ["ia", "productividad", "edición", "creadores", "automatización"],
            },
            {
                title: "Cómo configurar OBS en 10 minutos (plantilla gratuita)",
                views: "86k",
                engagement: "10.1% CTR • 68% retención",
                tags: ["obs", "streaming", "plantilla", "setup", "tutorial"],
            },
            {
                title: "Top 5 micrófonos USB 2024 (pruebas reales)",
                views: "73k",
                engagement: "9.3% CTR • 61% retención",
                tags: ["micrófono", "review", "audio", "creadores", "setup"],
            },
        ],
    },
    {
        name: "Gaming",
        trendingTags: ["gameplay", "estrategia", "parches", "meta", "trucos", "ranked", "fps", "mando"],
        hotIdeas: [
            {
                title: "Del Bronce al Diamante: guía express del meta actual",
                expectedViews: "75k - 120k",
                reason: "El contenido aspiracional con guía actualizada tiene alto CTR y retención.",
            },
            {
                title: "Los mejores ajustes de control para subir FPS sin perder calidad",
                expectedViews: "55k - 80k",
                reason: "Optimización técnica fácil de aplicar genera shares y watch time.",
            },
            {
                title: "Tier list del parche + builds que arrasan en ranked",
                expectedViews: "42k - 65k",
                reason: "Las tier lists son evergreen y capturan búsquedas tras cada actualización.",
            },
        ],
        winningVideos: [
            {
                title: "Configura sensibilidad como los pros (PC y consola)",
                views: "132k",
                engagement: "14.2% CTR • 69% retención",
                tags: ["fps", "sensibilidad", "pro", "guía", "ajustes"],
            },
            {
                title: "Ruta de farmeo más rápida del parche",
                views: "94k",
                engagement: "11.8% CTR • 64% retención",
                tags: ["parche", "farmeo", "trucos", "guía", "meta"],
            },
            {
                title: "¿Vale la pena el pase de temporada? Análisis honesto",
                views: "61k",
                engagement: "9.5% CTR • 58% retención",
                tags: ["review", "pase", "battle pass", "análisis", "temporada"],
            },
        ],
    },
    {
        name: "Educación",
        trendingTags: ["estudio", "mnemotecnia", "notas", "universidad", "planificación", "resumen", "productividad", "técnicas"],
        hotIdeas: [
            {
                title: "Estudia 2 horas y recuerda 8: método completo paso a paso",
                expectedViews: "52k - 78k",
                reason: "Propuesta de valor clara, aplicable y medible, ideal para miniaturas directas.",
            },
            {
                title: "Plantilla Notion para exámenes finales (gratuita)",
                expectedViews: "38k - 60k",
                reason: "Los recursos descargables atraen clics y comentarios, elevando el SEO de sesión.",
            },
            {
                title: "Cómo resumir libros en 20 minutos con IA",
                expectedViews: "44k - 68k",
                reason: "Combina IA con eficiencia; alto interés de estudiantes y profesionales.",
            },
        ],
        winningVideos: [
            {
                title: "Técnica Pomodoro 2.0 con descansos activos",
                views: "88k",
                engagement: "11.2% CTR • 70% retención",
                tags: ["pomodoro", "estudio", "productividad", "descansos", "rutina"],
            },
            {
                title: "Cómo tomar apuntes visuales que sí recuerdas",
                views: "57k",
                engagement: "8.4% CTR • 63% retención",
                tags: ["apuntes", "visual", "estudio", "memoria", "resumen"],
            },
            {
                title: "Plan semanal de estudios en Notion (plantilla incluida)",
                views: "49k",
                engagement: "7.9% CTR • 61% retención",
                tags: ["notion", "plantilla", "estudio", "plan", "organización"],
            },
        ],
    },
];

const sampleChannels: ChannelProfile[] = [
    {
        id: "creators-lab",
        name: "Creator's Lab",
        niche: "Tecnología",
        subscribers: "182k",
        videos: 214,
        avgCtr: 9.8,
        avgSeoScore: 82,
        tags: ["productividad", "ia", "edición", "automatización", "tutorial"],
        videosPublishedMonthly: 8,
        bestPerforming: [
            {
                title: "Automatiza YouTube con IA: 3 flujos en vivo",
                views: "120k",
                ctr: 12.1,
                seoScore: 87,
                tags: ["ia", "automatización", "youtube", "creadores"],
                niche: "Tecnología",
            },
            {
                title: "Atajos de edición que ahorran 5 horas por semana",
                views: "91k",
                ctr: 10.4,
                seoScore: 84,
                tags: ["edición", "productividad", "premiere", "after effects"],
                niche: "Tecnología",
            },
        ],
    },
    {
        id: "max-rank",
        name: "Max Rank",
        niche: "Gaming",
        subscribers: "324k",
        videos: 465,
        avgCtr: 11.2,
        avgSeoScore: 79,
        tags: ["meta", "fps", "guía", "ranked", "trucos"],
        videosPublishedMonthly: 15,
        bestPerforming: [
            {
                title: "Guía definitiva del meta: gana más partidas",
                views: "210k",
                ctr: 13.4,
                seoScore: 81,
                tags: ["meta", "guía", "ranked", "parche"],
                niche: "Gaming",
            },
            {
                title: "Configura tu mando en 5 minutos (ajustes pro)",
                views: "137k",
                ctr: 11.6,
                seoScore: 76,
                tags: ["mando", "ajustes", "fps", "setup"],
                niche: "Gaming",
            },
        ],
    },
    {
        id: "nota-10",
        name: "Nota 10",
        niche: "Educación",
        subscribers: "98k",
        videos: 132,
        avgCtr: 8.3,
        avgSeoScore: 85,
        tags: ["estudio", "notion", "plantilla", "memoria", "pomodoro"],
        videosPublishedMonthly: 6,
        bestPerforming: [
            {
                title: "Plantilla Notion para exámenes: planifica todo",
                views: "76k",
                ctr: 9.5,
                seoScore: 88,
                tags: ["notion", "plantilla", "estudio"],
                niche: "Educación",
            },
            {
                title: "Técnica de estudio que duplica tu retención",
                views: "61k",
                ctr: 8.1,
                seoScore: 82,
                tags: ["estudio", "retención", "memoria"],
                niche: "Educación",
            },
        ],
    },
];

const colors = ["#7C3AED", "#22C55E", "#06B6D4", "#F59E0B", "#F43F5E"];

function normalizeKeyword(word: string) {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^\w\s-]/g, "")
        .trim();
}

function extractKeywords(text: string) {
    return text
        .split(/\s+/)
        .map(normalizeKeyword)
        .filter((w) => w && !stopWords.has(w));
}

function calculateSeoScore(title: string, description: string, tags: string[]) {
    const titleLength = title.length;
    const descLength = description.length;
    const titleScore = Math.min(100, Math.max(40, (titleLength / 70) * 100));
    const descScore = Math.min(100, Math.max(45, (descLength / 250) * 100));
    const tagScore = Math.min(100, tags.length * 7.5 + 35);
    return Math.round((titleScore * 0.45 + descScore * 0.25 + tagScore * 0.3) / 1);
}

function computeKeywordCoverage(keywords: string[]) {
    const counts: Record<string, number> = {};
    keywords.forEach((kw) => {
        counts[kw] = (counts[kw] || 0) + 1;
    });
    const total = keywords.length || 1;
    return Object.entries(counts)
        .map(([keyword, count]) => ({ keyword, weight: Math.round((count / total) * 100) }))
        .sort((a, b) => b.weight - a.weight);
}

export default function VidiqInsights() {
    const [videoTitle, setVideoTitle] = useState("Cómo crecer en YouTube con IA y buenas miniaturas");
    const [videoDescription, setVideoDescription] = useState(
        "Guía paso a paso para optimizar tus videos con inteligencia artificial, títulos efectivos y etiquetas que posicionan."
    );
    const [niche, setNiche] = useState("Tecnología");
    const [selectedChannel, setSelectedChannel] = useState<ChannelProfile>(sampleChannels[0]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredChannels = useMemo(
        () =>
            sampleChannels.filter(
                (channel) =>
                    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    channel.niche.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [searchTerm]
    );

    const analysis: AnalysisResult = useMemo(() => {
        const keywords = extractKeywords(`${videoTitle} ${videoDescription}`);
        const nicheProfile = nicheProfiles.find((profile) => profile.name === niche);
        const trendingTags = nicheProfile?.trendingTags ?? [];
        const combinedTags = Array.from(new Set([...keywords, ...trendingTags])).slice(0, 18);

        const seoScore = calculateSeoScore(videoTitle, videoDescription, combinedTags);
        const ctrScore = Math.min(100, Math.round((50 + (videoTitle.length % 30) + combinedTags.length * 2.5)));
        const retentionScore = Math.min(100, Math.round(60 + (videoDescription.length % 25)));
        const keywordCoverage = computeKeywordCoverage(combinedTags).slice(0, 10);

        const summary =
            "Análisis completado: título competitivo, buen volumen de palabras clave y etiquetas enfocadas al nicho. Refuerza la miniatura con 2 palabras poderosas y agrega una llamada a la acción clara.";

        return {
            seoScore,
            ctrScore,
            retentionScore,
            recommendedTags: combinedTags,
            summary,
            keywordCoverage,
        };
    }, [videoDescription, videoTitle, niche]);

    const nicheProfile = useMemo(() => nicheProfiles.find((profile) => profile.name === niche) ?? nicheProfiles[0], [niche]);

    return (
        <div className="insights-grid">
            <header className="hero">
                <div>
                    <p className="eyebrow">Analizador estilo vidIQ • 100% funcional</p>
                    <h1>Optimiza videos, canales y etiquetas con IA ligera</h1>
                    <p className="lede">
                        Audita títulos, CTR estimado, SEO, retención y descubre las etiquetas más fuertes según nicho. Busca
                        canales, mira su salud y toma ideas listas para producir.
                    </p>
                    <div className="hero-metrics">
                        <div className="metric-card">
                            <span>SEO estimado</span>
                            <strong>{analysis.seoScore}%</strong>
                            <small>Longitud óptima de título y densidad de etiquetas</small>
                        </div>
                        <div className="metric-card">
                            <span>CTR potencial</span>
                            <strong>{analysis.ctrScore}%</strong>
                            <small>Calculado por fuerza del título + tendencia del nicho</small>
                        </div>
                        <div className="metric-card">
                            <span>Retención prevista</span>
                            <strong>{analysis.retentionScore}%</strong>
                            <small>Basado en claridad de propuesta y estructura</small>
                        </div>
                    </div>
                </div>
                <div className="glass card">
                    <h2>Analizar video</h2>
                    <label>
                        Título
                        <input
                            value={videoTitle}
                            onChange={(e) => setVideoTitle(e.target.value)}
                            placeholder="Ej. Cómo crecer en YouTube con IA"
                        />
                    </label>
                    <label>
                        Descripción corta
                        <textarea
                            value={videoDescription}
                            onChange={(e) => setVideoDescription(e.target.value)}
                            rows={4}
                            placeholder="Resume el contenido, beneficios y recursos que incluyes"
                        />
                    </label>
                    <label>
                        Nicho
                        <select value={niche} onChange={(e) => setNiche(e.target.value)}>
                            {nicheProfiles.map((profile) => (
                                <option key={profile.name}>{profile.name}</option>
                            ))}
                        </select>
                    </label>
                    <div className="tag-pills">
                        {analysis.recommendedTags.slice(0, 10).map((tag, idx) => (
                            <span key={tag} className="pill" style={{ background: colors[idx % colors.length] + "15" }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <p className="hint">Sugerimos {analysis.recommendedTags.length} etiquetas combinando keywords y tendencia.</p>
                </div>
            </header>

            <section className="grid two">
                <div className="glass card">
                    <div className="section-header">
                        <h3>Resultado del análisis</h3>
                        <span className="badge">IA rápida</span>
                    </div>
                    <p className="summary">{analysis.summary}</p>
                    <div className="progress-grid">
                        <div>
                            <p>SEO</p>
                            <div className="progress"><span style={{ width: `${analysis.seoScore}%` }} /></div>
                            <small>Longitud del título y descripción balanceados.</small>
                        </div>
                        <div>
                            <p>CTR</p>
                            <div className="progress accent"><span style={{ width: `${analysis.ctrScore}%` }} /></div>
                            <small>Fuerza de palabra clave + originalidad.</small>
                        </div>
                        <div>
                            <p>Retención</p>
                            <div className="progress green"><span style={{ width: `${analysis.retentionScore}%` }} /></div>
                            <small>Estructura narrativa clara y promesa rápida.</small>
                        </div>
                    </div>
                    <div className="keyword-grid">
                        {analysis.keywordCoverage.map((item, idx) => (
                            <div className="keyword-card" key={item.keyword}>
                                <span className="pill" style={{ background: colors[idx % colors.length] + "25" }}>
                                    #{item.keyword}
                                </span>
                                <strong>{item.weight}%</strong>
                                <small>peso en el set de etiquetas</small>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass card">
                    <div className="section-header">
                        <h3>Ideas que posicionan en {nicheProfile.name}</h3>
                        <span className="badge ghost">Inspiración</span>
                    </div>
                    <ul className="idea-list">
                        {nicheProfile.hotIdeas.map((idea) => (
                            <li key={idea.title}>
                                <div>
                                    <p className="idea-title">{idea.title}</p>
                                    <p className="idea-reason">{idea.reason}</p>
                                </div>
                                <span className="idea-views">{idea.expectedViews}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="trending-tags">
                        {nicheProfile.trendingTags.map((tag, idx) => (
                            <span className="pill solid" style={{ background: colors[idx % colors.length] }} key={tag}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="glass card">
                <div className="section-header">
                    <div>
                        <p className="eyebrow">Explorar canales</p>
                        <h3>Busca canales y mira su salud SEO/CTR</h3>
                    </div>
                    <input
                        className="search"
                        placeholder="Buscar por nombre o nicho"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="channel-grid">
                    {filteredChannels.map((channel) => (
                        <button
                            className={`channel-card ${selectedChannel.id === channel.id ? "active" : ""}`}
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel)}
                        >
                            <div className="channel-top">
                                <div>
                                    <p className="channel-name">{channel.name}</p>
                                    <p className="channel-meta">{channel.subscribers} suscriptores • {channel.niche}</p>
                                </div>
                                <span className="badge">{channel.videos} videos</span>
                            </div>
                            <div className="channel-metrics">
                                <div>
                                    <p>CTR medio</p>
                                    <strong>{channel.avgCtr}%</strong>
                                </div>
                                <div>
                                    <p>SEO</p>
                                    <strong>{channel.avgSeoScore}</strong>
                                </div>
                                <div>
                                    <p>Mensuales</p>
                                    <strong>{channel.videosPublishedMonthly}</strong>
                                </div>
                            </div>
                            <div className="tag-pills">
                                {channel.tags.slice(0, 6).map((tag, idx) => (
                                    <span key={tag} className="pill" style={{ background: colors[idx % colors.length] + "18" }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
                <div className="best-videos">
                    <div className="section-header">
                        <div>
                            <p className="eyebrow">Videos que rankean</p>
                            <h4>{selectedChannel.name}</h4>
                        </div>
                        <p className="channel-meta">{selectedChannel.niche} • {selectedChannel.subscribers} • CTR {selectedChannel.avgCtr}%</p>
                    </div>
                    <div className="video-table">
                        {selectedChannel.bestPerforming.map((video) => (
                            <div className="video-row" key={video.title}>
                                <div>
                                    <p className="idea-title">{video.title}</p>
                                    <p className="idea-reason">SEO {video.seoScore} • CTR {video.ctr}% • {video.views} vistas</p>
                                </div>
                                <div className="tag-pills">
                                    {video.tags.map((tag, idx) => (
                                        <span key={tag} className="pill" style={{ background: colors[idx % colors.length] + "16" }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="glass card">
                <div className="section-header">
                    <div>
                        <p className="eyebrow">Top videos del nicho</p>
                        <h3>Qué está funcionando ahora mismo</h3>
                    </div>
                </div>
                <div className="video-grid">
                    {nicheProfile.winningVideos.map((video) => (
                        <div className="winning-card" key={video.title}>
                            <p className="idea-title">{video.title}</p>
                            <p className="idea-reason">{video.engagement}</p>
                            <p className="idea-views">{video.views} vistas</p>
                            <div className="tag-pills">
                                {video.tags.map((tag, idx) => (
                                    <span key={tag} className="pill" style={{ background: colors[idx % colors.length] + "18" }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
